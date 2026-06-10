package com.nexcrm.controller;

import com.nexcrm.entity.Customer;
import com.nexcrm.entity.Plan;
import com.nexcrm.repository.CustomerRepository;
import com.nexcrm.repository.PlanRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final PlanRepository planRepository;

    public CustomerController(CustomerRepository customerRepository,
                               PasswordEncoder passwordEncoder,
                               PlanRepository planRepository) {
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
        this.planRepository = planRepository;
    }

    @GetMapping
    public ResponseEntity<?> getAllCustomers(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String status) {

        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Customer> result;
        if (!search.isBlank()) {
            result = customerRepository.searchCustomers(search, pageable);
        } else if (status != null && !status.isBlank()) {
            try {
                Customer.SubscriptionStatus statusEnum = Customer.SubscriptionStatus.valueOf(status.toUpperCase());
                result = customerRepository.findBySubscriptionStatus(statusEnum, pageable);
            } catch (IllegalArgumentException e) {
                result = customerRepository.findAll(pageable);
            }
        } else {
            result = customerRepository.findAll(pageable);
        }

        return ResponseEntity.ok(Map.of(
                "content", result.getContent(),
                "totalElements", result.getTotalElements(),
                "totalPages", result.getTotalPages(),
                "currentPage", result.getNumber(),
                "size", result.getSize()
        ));
    }

    @GetMapping("/recent")
    public List<Customer> getRecentCustomers() {
        return customerRepository.findTop10ByOrderByCreatedAtDesc();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable Long id) {
        return customerRepository.findById(id)
                .map(c -> ResponseEntity.ok(c))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Customer> createCustomer(@RequestBody Customer customer) {
        if (customer.getPassword() != null && !customer.getPassword().isEmpty()) {
            customer.setPassword(passwordEncoder.encode(customer.getPassword()));
        }
        Customer saved = customerRepository.save(customer);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable Long id, @RequestBody Customer details) {
        return customerRepository.findById(id)
                .map(customer -> {
                    if (details.getName() != null) customer.setName(details.getName());
                    if (details.getEmail() != null) customer.setEmail(details.getEmail());
                    if (details.getPhone() != null) customer.setPhone(details.getPhone());
                    if (details.getCompany() != null) customer.setCompany(details.getCompany());
                    if (details.getNotes() != null) customer.setNotes(details.getNotes());
                    if (details.getPipelineStage() != null) customer.setPipelineStage(details.getPipelineStage());
                    if (details.getSubscriptionStatus() != null) customer.setSubscriptionStatus(details.getSubscriptionStatus());
                    if (details.getPlan() != null) customer.setPlan(details.getPlan());
                    if (details.getCountry() != null) customer.setCountry(details.getCountry());
                    if (details.getCity() != null) customer.setCity(details.getCity());
                    if (details.getBillingCycle() != null) customer.setBillingCycle(details.getBillingCycle());
                    return ResponseEntity.ok(customerRepository.save(customer));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/plan")
    public ResponseEntity<?> updateCustomerPlan(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        return customerRepository.findById(id)
                .map(customer -> {
                    if (body.containsKey("planId")) {
                        Long planId = Long.valueOf(body.get("planId").toString());
                        Plan plan = planRepository.findById(planId).orElse(null);
                        customer.setPlan(plan);
                    }
                    if (body.containsKey("billingCycle")) {
                        try {
                            customer.setBillingCycle(Customer.BillingCycle.valueOf(body.get("billingCycle").toString()));
                        } catch (IllegalArgumentException ignored) {}
                    }
                    return ResponseEntity.ok(customerRepository.save(customer));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateCustomerStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return customerRepository.findById(id)
                .map(customer -> {
                    if (body.containsKey("status")) {
                        try {
                            customer.setSubscriptionStatus(Customer.SubscriptionStatus.valueOf(body.get("status")));
                            // Sync pipeline stage with status
                            customer.setPipelineStage(body.get("status"));
                        } catch (IllegalArgumentException ignored) {}
                    }
                    if (body.containsKey("pipelineStage")) {
                        customer.setPipelineStage(body.get("pipelineStage"));
                    }
                    return ResponseEntity.ok(customerRepository.save(customer));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        if (!customerRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        customerRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        long total = customerRepository.count();
        long active = customerRepository.countBySubscriptionStatus(Customer.SubscriptionStatus.ACTIVE);
        long trial = customerRepository.countBySubscriptionStatus(Customer.SubscriptionStatus.TRIAL);
        long churned = customerRepository.countBySubscriptionStatus(Customer.SubscriptionStatus.CHURNED);

        List<Object[]> pipeline = customerRepository.countByPipelineStage();

        return ResponseEntity.ok(Map.of(
                "total", total,
                "active", active,
                "trial", trial,
                "churned", churned,
                "pipeline", pipeline
        ));
    }
}
