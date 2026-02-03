
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import API_URL from '../config';

class NotificationService {
    constructor() {
        this.client = null;
        this.subscribers = [];
        this.connected = false;
    }

    connect(onMessageReceived) {
        if (this.client && this.client.active) return;

        // Use SockJS for best compatibility
        const socketUrl = `${API_URL.replace('/api', '')}/ws`;
        console.log('STOMP: Connecting via SockJS to ' + socketUrl);

        this.client = new Client({
            webSocketFactory: () => new SockJS(socketUrl),
            reconnectDelay: 5000,
            debug: (str) => {
                console.log('STOMP Debug: ' + str);
            },
            onConnect: () => {
                console.log('Gflix: Connected to Notification WebSocket');
                this.connected = true;

                // Subscribe to System Broadcasts (Topic)
                this.client.subscribe('/topic/broadcast', (message) => {
                    const notification = JSON.parse(message.body);
                    this.notifySubscribers(notification);
                    onMessageReceived(notification);
                });
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
            },
        });

        this.client.activate();
    }

    notifySubscribers(notification) {
        this.subscribers.forEach(callback => callback(notification));
    }

    subscribe(callback) {
        this.subscribers.push(callback);
        return () => {
            this.subscribers = this.subscribers.filter(cb => cb !== callback);
        };
    }

    disconnect() {
        if (this.client) {
            this.client.deactivate();
            this.client = null;
            this.connected = false;
        }
    }
}

export const notificationService = new NotificationService();
