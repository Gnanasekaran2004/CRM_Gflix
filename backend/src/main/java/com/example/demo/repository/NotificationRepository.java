package com.example.demo.repository;

import com.example.demo.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    List<Notification> findByRecipientOrderByCreatedAtDesc(String recipient);

    List<Notification> findByRecipientIsNullOrderByCreatedAtDesc(); // Broadcasts

    List<Notification> findByIsReadFalseAndRecipient(String recipient);
}
