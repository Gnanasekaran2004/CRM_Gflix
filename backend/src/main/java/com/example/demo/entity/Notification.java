package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(nullable = false)
    private String type; // INFO, WARNING, CRITICAL, SUCCESS

    private String priority; // LOW, NORMAL, HIGH, EMERGENCY

    private String category; // SYSTEM, ENERGY, SECURITY, TASK

    private String triggeredBy; // e.g., "SYSTEM", "admin"

    private String recipient; // null for broadcast, otherwise username

    @CreationTimestamp
    private LocalDateTime createdAt;

    private boolean isRead = false;
}
