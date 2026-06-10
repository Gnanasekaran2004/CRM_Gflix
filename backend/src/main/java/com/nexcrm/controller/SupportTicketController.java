package com.nexcrm.controller;

import com.nexcrm.entity.Customer;
import com.nexcrm.entity.SupportTicket;
import com.nexcrm.repository.CustomerRepository;
import com.nexcrm.repository.SupportTicketRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
public class SupportTicketController {

    private final SupportTicketRepository ticketRepository;
    private final CustomerRepository customerRepository;

    public SupportTicketController(SupportTicketRepository ticketRepository, CustomerRepository customerRepository) {
        this.ticketRepository = ticketRepository;
        this.customerRepository = customerRepository;
    }

    @GetMapping
    public List<SupportTicket> getAllTickets() {
        return ticketRepository.findAllByOrderByCreatedAtDesc();
    }

    @GetMapping("/customer/{customerId}")
    public List<SupportTicket> getTicketsByCustomer(@PathVariable Long customerId) {
        return ticketRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }

    @PostMapping
    public ResponseEntity<?> createTicket(@RequestBody Map<String, Object> body) {
        Long customerId = Long.valueOf(body.get("customerId").toString());
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        SupportTicket ticket = SupportTicket.builder()
                .customer(customer)
                .subject(body.get("subject").toString())
                .description(body.get("description").toString())
                .priority(body.containsKey("priority")
                        ? SupportTicket.Priority.valueOf(body.get("priority").toString())
                        : SupportTicket.Priority.MEDIUM)
                .category(body.containsKey("category")
                        ? SupportTicket.Category.valueOf(body.get("category").toString())
                        : SupportTicket.Category.GENERAL)
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(ticketRepository.save(ticket));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ticketRepository.findById(id)
                .map(ticket -> {
                    ticket.setStatus(SupportTicket.TicketStatus.valueOf(body.get("status")));
                    if (body.containsKey("agentNote")) ticket.setAgentNote(body.get("agentNote"));
                    if (ticket.getStatus() == SupportTicket.TicketStatus.RESOLVED) {
                        ticket.setResolvedAt(LocalDateTime.now());
                    }
                    return ResponseEntity.ok(ticketRepository.save(ticket));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok(Map.of(
                "total", ticketRepository.count(),
                "open", ticketRepository.countByStatus(SupportTicket.TicketStatus.OPEN),
                "inProgress", ticketRepository.countByStatus(SupportTicket.TicketStatus.IN_PROGRESS),
                "resolved", ticketRepository.countByStatus(SupportTicket.TicketStatus.RESOLVED)
        ));
    }
}
