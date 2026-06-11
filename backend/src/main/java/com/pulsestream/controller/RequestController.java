package com.pulsestream.controller;

import com.pulsestream.entity.AccessRequest;
import com.pulsestream.entity.Customer;
import com.pulsestream.repository.AccessRequestRepository;
import com.pulsestream.repository.CustomerRepository;
import com.pulsestream.repository.PlanRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/requests")
public class RequestController {

    private final AccessRequestRepository requestRepository;
    private final CustomerRepository customerRepository;
    private final PlanRepository planRepository;
    private final PasswordEncoder passwordEncoder;

    public RequestController(AccessRequestRepository requestRepository,
                              CustomerRepository customerRepository,
                              PlanRepository planRepository,
                              PasswordEncoder passwordEncoder) {
        this.requestRepository = requestRepository;
        this.customerRepository = customerRepository;
        this.planRepository = planRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public List<AccessRequest> getAllRequests() {
        return requestRepository.findAllByOrderByCreatedAtDesc();
    }

    @GetMapping("/pending")
    public List<AccessRequest> getPendingRequests() {
        return requestRepository.findByStatusOrderByCreatedAtDesc(AccessRequest.RequestStatus.PENDING);
    }

    @PostMapping
    public ResponseEntity<?> createRequest(@RequestBody AccessRequest request) {
        if (requestRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("error", "A request with this email already exists"));
        }
        if (customerRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already registered as a customer"));
        }

        // Hash password before storing
        request.setPassword(passwordEncoder.encode(request.getPassword()));
        AccessRequest saved = requestRepository.save(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveRequest(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        return requestRepository.findById(id)
                .map(req -> {
                    // Create customer from the approved request
                    Customer customer = Customer.builder()
                            .name(req.getName())
                            .email(req.getEmail())
                            .phone(req.getPhone())
                            .company(req.getCompany())
                            .password(req.getPassword()) // already hashed
                            .plan(req.getRequestedPlan())
                            .subscriptionStatus(Customer.SubscriptionStatus.TRIAL)
                            .pipelineStage("TRIAL")
                            .subscriptionStartDate(LocalDateTime.now())
                            .build();

                    customerRepository.save(customer);

                    req.setStatus(AccessRequest.RequestStatus.APPROVED);
                    req.setReviewedAt(LocalDateTime.now());
                    if (body != null && body.containsKey("note")) {
                        req.setAdminNote(body.get("note"));
                    }
                    requestRepository.save(req);

                    return ResponseEntity.ok(Map.of("message", "Request approved. Customer account created."));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectRequest(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        return requestRepository.findById(id)
                .map(req -> {
                    req.setStatus(AccessRequest.RequestStatus.REJECTED);
                    req.setReviewedAt(LocalDateTime.now());
                    if (body != null && body.containsKey("note")) {
                        req.setAdminNote(body.get("note"));
                    }
                    requestRepository.save(req);
                    return ResponseEntity.ok(Map.of("message", "Request rejected."));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok(Map.of(
                "total", requestRepository.count(),
                "pending", requestRepository.countByStatus(AccessRequest.RequestStatus.PENDING),
                "approved", requestRepository.countByStatus(AccessRequest.RequestStatus.APPROVED),
                "rejected", requestRepository.countByStatus(AccessRequest.RequestStatus.REJECTED)
        ));
    }
}
