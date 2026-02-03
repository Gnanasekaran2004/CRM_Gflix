package com.example.demo.controller;

import com.example.demo.entity.Customer;
import com.example.demo.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class CustomerAuthController {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/customer-login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String password = payload.get("password");

        if (email == null || password == null) {
            return new ResponseEntity<>("Email and password are required", HttpStatus.BAD_REQUEST);
        }

        System.out.println("Debug: Attempting login for email: " + email);
        Optional<Customer> customerOpt = customerRepository.findByEmail(email);

        if (customerOpt.isPresent()) {
            Customer customer = customerOpt.get();
            System.out.println("Debug: Customer found - " + customer.getEmail());
            System.out.println("Debug: Input Password - " + password);
            System.out.println("Debug: Stored Password - " + customer.getPassword());

            boolean match = passwordEncoder.matches(password, customer.getPassword());
            System.out.println("Debug: Password Match - " + match);

            if (match) {

                String token = "Basic " + Base64.getEncoder().encodeToString((email + ":" + password).getBytes());

                Map<String, String> response = new HashMap<>();
                response.put("token", token);
                response.put("name", customer.getName());
                response.put("role", customer.getRole());

                return new ResponseEntity<>(response, HttpStatus.OK);
            }
        }

        return new ResponseEntity<>("Invalid email or password", HttpStatus.UNAUTHORIZED);
    }
}
