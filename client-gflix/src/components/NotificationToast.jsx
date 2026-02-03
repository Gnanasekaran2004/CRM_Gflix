import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { notificationService } from '../services/notificationService';
import { AlertCircle, X, CheckCircle, Info, Bell } from 'lucide-react';

const NotificationToast = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Debounce connection to handle React Strict Mode double-mount
        const timer = setTimeout(() => {
            notificationService.connect((newNotification) => {
                // Add unique ID if missing
                const notif = { ...newNotification, id: newNotification.id || Date.now() };
                setNotifications(prev => [notif, ...prev]);

                // Auto-dismiss non-critical alerts after 5s
                if (notif.type !== 'CRITICAL') {
                    setTimeout(() => {
                        removeNotification(notif.id);
                    }, 5000);
                }
            });
        }, 300); // 300ms delay ensures we only connect once the component is stable

        return () => {
            clearTimeout(timer);
            notificationService.disconnect();
        };
    }, []);

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
            <AnimatePresence>
                {notifications.map((notif) => (
                    <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 50, scale: 0.9 }}
                        layout
                        className={`pointer-events-auto p-4 rounded-lg shadow-2xl backdrop-blur-md border border-white/10 flex items-start gap-3 
                            ${notif.type === 'CRITICAL' ? 'bg-red-900/90 text-white' :
                                notif.type === 'SUCCESS' ? 'bg-green-900/90 text-white' :
                                    'bg-gray-900/90 text-white'}`}
                    >
                        <div className="mt-1">
                            {notif.type === 'CRITICAL' ? <AlertCircle className="w-5 h-5 text-red-400" /> :
                                notif.type === 'SUCCESS' ? <CheckCircle className="w-5 h-5 text-green-400" /> :
                                    <Bell className="w-5 h-5 text-blue-400" />}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-sm">{notif.title}</h4>
                            <p className="text-xs opacity-90 mt-1">{notif.message}</p>
                        </div>
                        <button
                            onClick={() => removeNotification(notif.id)}
                            className="text-white/50 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default NotificationToast;
