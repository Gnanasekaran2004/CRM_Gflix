package com.nexcrm.controller;

import com.nexcrm.entity.AccessRequest;
import com.nexcrm.entity.Customer;
import com.nexcrm.entity.SupportTicket;
import com.nexcrm.repository.AccessRequestRepository;
import com.nexcrm.repository.CustomerRepository;
import com.nexcrm.repository.SupportTicketRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final CustomerRepository customerRepository;
    private final AccessRequestRepository requestRepository;
    private final SupportTicketRepository ticketRepository;

    public DashboardController(CustomerRepository customerRepository,
                                AccessRequestRepository requestRepository,
                                SupportTicketRepository ticketRepository) {
        this.customerRepository = customerRepository;
        this.requestRepository = requestRepository;
        this.ticketRepository = ticketRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        long totalCustomers = customerRepository.count();
        long activeCustomers = customerRepository.countBySubscriptionStatus(Customer.SubscriptionStatus.ACTIVE);
        long trialCustomers = customerRepository.countBySubscriptionStatus(Customer.SubscriptionStatus.TRIAL);
        long churnedCustomers = customerRepository.countBySubscriptionStatus(Customer.SubscriptionStatus.CHURNED);

        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        long newThisMonth = customerRepository.countByCreatedAtAfter(startOfMonth);

        long pendingRequests = requestRepository.countByStatus(AccessRequest.RequestStatus.PENDING);
        long openTickets = ticketRepository.countByStatus(SupportTicket.TicketStatus.OPEN);
        long inProgressTickets = ticketRepository.countByStatus(SupportTicket.TicketStatus.IN_PROGRESS);

        double churnRate = totalCustomers > 0 ? ((double) churnedCustomers / totalCustomers) * 100 : 0;

        // Real MRR: sum of active customers' monthly plan prices
        List<Customer> allCustomers = customerRepository.findAll();
        double totalMrr = allCustomers.stream()
                .filter(c -> c.getSubscriptionStatus() == Customer.SubscriptionStatus.ACTIVE && c.getPlan() != null)
                .mapToDouble(c -> {
                    if (c.getBillingCycle() == Customer.BillingCycle.ANNUAL) {
                        return c.getPlan().getAnnualPrice() / 12.0;
                    }
                    return c.getPlan().getMonthlyPrice() != null ? c.getPlan().getMonthlyPrice() : 0.0;
                })
                .sum();

        var recentCustomers = customerRepository.findTop10ByOrderByCreatedAtDesc();

        stats.put("totalCustomers", totalCustomers);
        stats.put("activeCustomers", activeCustomers);
        stats.put("trialCustomers", trialCustomers);
        stats.put("churnedCustomers", churnedCustomers);
        stats.put("newThisMonth", newThisMonth);
        stats.put("pendingRequests", pendingRequests);
        stats.put("openTickets", openTickets);
        stats.put("inProgressTickets", inProgressTickets);
        stats.put("churnRate", Math.round(churnRate * 10.0) / 10.0);
        stats.put("mrr", Math.round(totalMrr * 100.0) / 100.0);
        stats.put("recentCustomers", recentCustomers);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/growth")
    public ResponseEntity<List<Map<String, Object>>> getGrowthData() {
        List<Map<String, Object>> result = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        for (int i = 5; i >= 0; i--) {
            LocalDateTime monthStart = now.minusMonths(i).withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
            LocalDateTime monthEnd = monthStart.plusMonths(1);

            long total = customerRepository.countByCreatedAtBetween(
                    LocalDateTime.of(2000, 1, 1, 0, 0),
                    monthEnd
            );
            long active = customerRepository.countByCreatedAtBetweenAndStatus(monthStart, monthEnd, Customer.SubscriptionStatus.ACTIVE);
            long newThisMonth = customerRepository.countByCreatedAtBetween(monthStart, monthEnd);

            String monthName = monthStart.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);

            Map<String, Object> entry = new HashMap<>();
            entry.put("month", monthName);
            entry.put("customers", total);
            entry.put("active", active);
            entry.put("newCustomers", newThisMonth);
            result.add(entry);
        }

        return ResponseEntity.ok(result);
    }

    @GetMapping("/mrr")
    public ResponseEntity<List<Map<String, Object>>> getMrrData() {
        List<Map<String, Object>> result = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        List<Customer> allCustomers = customerRepository.findAll();

        for (int i = 5; i >= 0; i--) {
            LocalDateTime monthEnd = now.minusMonths(i).withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0).plusMonths(1);
            String monthName = now.minusMonths(i).getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);

            double mrr = allCustomers.stream()
                    .filter(c -> c.getPlan() != null
                            && c.getSubscriptionStatus() == Customer.SubscriptionStatus.ACTIVE
                            && c.getCreatedAt() != null
                            && c.getCreatedAt().isBefore(monthEnd))
                    .mapToDouble(c -> {
                        if (c.getBillingCycle() == Customer.BillingCycle.ANNUAL) {
                            return c.getPlan().getAnnualPrice() / 12.0;
                        }
                        return c.getPlan().getMonthlyPrice() != null ? c.getPlan().getMonthlyPrice() : 0.0;
                    })
                    .sum();

            long churned = allCustomers.stream()
                    .filter(c -> c.getSubscriptionStatus() == Customer.SubscriptionStatus.CHURNED
                            && c.getCreatedAt() != null
                            && c.getCreatedAt().isBefore(monthEnd))
                    .count();

            Map<String, Object> entry = new HashMap<>();
            entry.put("month", monthName);
            entry.put("mrr", Math.round(mrr * 100.0) / 100.0);
            entry.put("churned", churned);
            result.add(entry);
        }

        return ResponseEntity.ok(result);
    }

    @GetMapping("/plans")
    public ResponseEntity<List<Map<String, Object>>> getPlanDistribution() {
        List<Customer> customers = customerRepository.findAll();

        Map<String, Long> planCounts = customers.stream()
                .filter(c -> c.getPlan() != null)
                .collect(Collectors.groupingBy(c -> c.getPlan().getName(), Collectors.counting()));

        List<Map<String, Object>> result = planCounts.entrySet().stream()
                .map(e -> {
                    Map<String, Object> entry = new HashMap<>();
                    entry.put("name", e.getKey());
                    entry.put("value", e.getValue());
                    return entry;
                })
                .sorted(Comparator.comparingLong(e -> -(Long) e.get("value")))
                .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    @GetMapping("/countries")
    public ResponseEntity<List<Map<String, Object>>> getCountryDistribution() {
        List<Customer> customers = customerRepository.findAll();

        Map<String, Long> countryCounts = customers.stream()
                .filter(c -> c.getCountry() != null && !c.getCountry().equals("Unknown"))
                .collect(Collectors.groupingBy(Customer::getCountry, Collectors.counting()));

        List<Map<String, Object>> result = countryCounts.entrySet().stream()
                .map(e -> {
                    Map<String, Object> entry = new HashMap<>();
                    entry.put("country", e.getKey());
                    entry.put("customers", e.getValue());
                    return entry;
                })
                .sorted(Comparator.comparingLong(e -> -(Long) e.get("customers")))
                .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }
}
