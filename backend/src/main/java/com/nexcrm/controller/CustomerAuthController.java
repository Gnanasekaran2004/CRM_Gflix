package com.nexcrm.controller;

import com.nexcrm.dto.AuthResponse;
import com.nexcrm.dto.LoginRequest;
import com.nexcrm.entity.Customer;
import com.nexcrm.repository.CustomerRepository;
import com.nexcrm.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/customer-auth")
public class CustomerAuthController {

    private final AuthenticationManager authenticationManager;
    private final CustomerRepository customerRepository;
    private final JwtUtil jwtUtil;

    public CustomerAuthController(AuthenticationManager authenticationManager,
                                   CustomerRepository customerRepository,
                                   JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.customerRepository = customerRepository;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            String email = authentication.getName();
            Customer customer = customerRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Customer not found"));

            String accessToken = jwtUtil.generateToken(customer.getEmail(), "CUSTOMER", "CUSTOMER");
            String refreshToken = jwtUtil.generateRefreshToken(customer.getEmail());

            AuthResponse response = AuthResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .tokenType("Bearer")
                    .username(customer.getEmail())
                    .email(customer.getEmail())
                    .fullName(customer.getName())
                    .role("CUSTOMER")
                    .userType("CUSTOMER")
                    .userId(customer.getId())
                    .avatarUrl(customer.getAvatarUrl())
                    .build();

            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid email or password"));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentCustomer() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not authenticated"));
        }

        String email = auth.getName();
        return customerRepository.findByEmail(email)
                .map(c -> {
                    Map<String, Object> result = new HashMap<>();
                    result.put("id", c.getId());
                    result.put("name", c.getName());
                    result.put("email", c.getEmail());
                    result.put("phone", c.getPhone() != null ? c.getPhone() : "");
                    result.put("company", c.getCompany() != null ? c.getCompany() : "");
                    result.put("country", c.getCountry() != null ? c.getCountry() : "");
                    result.put("city", c.getCity() != null ? c.getCity() : "");
                    result.put("subscriptionStatus", c.getSubscriptionStatus().name());
                    result.put("pipelineStage", c.getPipelineStage());
                    result.put("billingCycle", c.getBillingCycle().name());
                    result.put("subscriptionStartDate", c.getSubscriptionStartDate());
                    result.put("subscriptionEndDate", c.getSubscriptionEndDate());
                    result.put("notes", c.getNotes() != null ? c.getNotes() : "");
                    result.put("avatarUrl", c.getAvatarUrl() != null ? c.getAvatarUrl() : "");
                    result.put("createdAt", c.getCreatedAt());

                    if (c.getPlan() != null) {
                        Map<String, Object> plan = new HashMap<>();
                        plan.put("id", c.getPlan().getId());
                        plan.put("name", c.getPlan().getName());
                        plan.put("description", c.getPlan().getDescription());
                        plan.put("monthlyPrice", c.getPlan().getMonthlyPrice());
                        plan.put("annualPrice", c.getPlan().getAnnualPrice());
                        plan.put("maxScreens", c.getPlan().getMaxScreens());
                        plan.put("videoQuality", c.getPlan().getVideoQuality());
                        plan.put("downloadAllowed", c.getPlan().isDownloadAllowed());
                        plan.put("offlineViewing", c.getPlan().isOfflineViewing());
                        result.put("plan", plan);
                    } else {
                        result.put("plan", null);
                    }

                    return ResponseEntity.ok(result);
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Customer not found")));
    }
}
