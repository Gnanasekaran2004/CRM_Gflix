import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { notificationService } from '../../services/notificationService';
import NotificationIcon from '../ui/NotificationIcon';
import SpotlightCard from '../ui/SpotlightCard';

const NotificationCenter = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const containerRef = useRef(null);

    // Mock username - In real app, get from AuthContext
    const username = "admin";

    useEffect(() => {
        // Connect to WebSocket
        notificationService.connect(username, (newNotification) => {
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);

            // Play sound for critical alerts
            if (newNotification.type === 'CRITICAL') {
                new Audio('/assets/alert.mp3').play().catch(e => console.log('Audio blocked'));
            }
        });

        // Load initial (mock) or fetch from API
        // axios.get(`${API_URL}/api/notifications/user/${username}`).then(...)

        return () => notificationService.disconnect();
    }, [username]);

    const toggleOpen = () => setIsOpen(!isOpen);

    const markAllRead = () => {
        setUnreadCount(0);
        // api call to mark read
    };

    return (
        <div className="relative" ref={containerRef}>
            {/* Bell Trigger */}
            <button
                onClick={toggleOpen}
                className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Notifications"
            >
                <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-96 z-50 origin-top-right"
                    >
                        <SpotlightCard className="p-0 overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700" spotlightColor="rgba(59, 130, 246, 0.1)">
                            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-md">
                                <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllRead}
                                        className="text-xs text-blue-500 hover:text-blue-600 font-medium"
                                    >
                                        Mark all read
                                    </button>
                                )}
                            </div>

                            <div className="max-h-[400px] overflow-y-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                                        No new notifications
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {notifications.map((notif, index) => (
                                            <div key={notif.id || index} className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${notif.type === 'CRITICAL' ? 'bg-red-50/50 dark:bg-red-900/10' : ''}`}>
                                                <div className="flex gap-3">
                                                    <div className="mt-1">
                                                        <NotificationIcon type={notif.type} category={notif.category} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {notif.title}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                            {notif.message}
                                                        </p>
                                                        <span className="text-[10px] text-gray-400 mt-2 block">
                                                            {notif.createdAt ? new Date(notif.createdAt).toLocaleTimeString() : 'Just now'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </SpotlightCard>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationCenter;
