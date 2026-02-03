package com.example.demo.service;

import com.example.demo.entity.Notification;
import com.example.demo.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public Notification sendNotification(Notification notification) {
        // Save to DB
        Notification saved = notificationRepository.save(notification);

        // Broadcast to WebSocket
        if (saved.getRecipient() == null) {
            // Broadcast to all clients (public topic)
            messagingTemplate.convertAndSend("/topic/broadcast", saved);
        } else {
            // Send to specific user
            messagingTemplate.convertAndSendToUser(saved.getRecipient(), "/queue/notifications", saved);
        }

        return saved;
    }

    public List<Notification> getNotificationsForUser(String username) {
        return notificationRepository.findByRecipientOrderByCreatedAtDesc(username);
    }

    public List<Notification> getBroadcasts() {
        return notificationRepository.findByRecipientIsNullOrderByCreatedAtDesc();
    }

    public void markAsRead(java.util.UUID id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }
}
