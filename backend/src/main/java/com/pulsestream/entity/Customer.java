package com.pulsestream.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.time.LocalDateTime;

@Entity
@Table(name = "customers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private String phone;
    private String company;
    private String avatarUrl;
    private String notes;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private SubscriptionStatus subscriptionStatus = SubscriptionStatus.TRIAL;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "plan_id")
    private Plan plan;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private BillingCycle billingCycle = BillingCycle.MONTHLY;

    private LocalDateTime subscriptionStartDate;
    private LocalDateTime subscriptionEndDate;

    @Builder.Default
    private String pipelineStage = "LEAD"; // LEAD, TRIAL, ACTIVE, CHURNED

    @Builder.Default
    private String country = "Unknown";
    private String city;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum SubscriptionStatus {
        TRIAL, ACTIVE, PAUSED, CHURNED, EXPIRED
    }

    public enum BillingCycle {
        MONTHLY, ANNUAL
    }
}
