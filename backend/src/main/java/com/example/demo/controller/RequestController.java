package com.example.demo.controller;

import com.example.demo.entity.AccessRequest;
import com.example.demo.entity.Customer;
import com.example.demo.entity.AccessRequest.RequestStatus;
import com.example.demo.repository.AccessRequestRepository;
import com.example.demo.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/requests")
public class RequestController {

    @Autowired
    private AccessRequestRepository requestRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    
    @PostMapping
    public ResponseEntity<AccessRequest> submitRequest(@RequestBody AccessRequest request) {
        try {
            
            request.setPassword(passwordEncoder.encode(request.getPassword()));
            request.setStatus(RequestStatus.PENDING);
            AccessRequest savedRequest = requestRepository.save(request);
            return new ResponseEntity<>(savedRequest, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    
    @GetMapping
    public List<AccessRequest> getAllRequests() {
        return requestRepository.findAll();
    }


    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approveRequest(@PathVariable Long id) {
        Optional<AccessRequest> requestOpt = requestRepository.findById(id);
        if (requestOpt.isEmpty()) {
            return new ResponseEntity<>("Request not found", HttpStatus.NOT_FOUND);
        }

        AccessRequest request = requestOpt.get();
        if (request.getStatus() != RequestStatus.PENDING) {
            return new ResponseEntity<>("Request already processed", HttpStatus.BAD_REQUEST);
        }

        try {
            
            Customer newCustomer = new Customer();
            newCustomer.setName(request.getName());
            newCustomer.setEmail(request.getEmail());
            newCustomer.setPhone(request.getPhone());
            newCustomer.setCompany(request.getCompany());
            newCustomer.setPassword(request.getPassword()); 
            newCustomer.setRole("CUSTOMER");

            customerRepository.save(newCustomer);
            request.setStatus(RequestStatus.APPROVED);
            requestRepository.save(request);

            return new ResponseEntity<>("Request approved and customer created", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error approving request: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    
    @PostMapping("/{id}/reject")
    public ResponseEntity<?> rejectRequest(@PathVariable Long id) {
        Optional<AccessRequest> requestOpt = requestRepository.findById(id);
        if (requestOpt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        AccessRequest request = requestOpt.get();
        request.setStatus(RequestStatus.REJECTED);
        requestRepository.save(request);

        return new ResponseEntity<>("Request rejected", HttpStatus.OK);
    }
}
