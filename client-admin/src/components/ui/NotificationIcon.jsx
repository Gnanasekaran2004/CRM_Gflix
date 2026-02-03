import React from 'react';
import {
    Info,
    AlertTriangle,
    XCircle,
    CheckCircle,
    Bell,
    Zap,
    ShieldAlert,
    Thermometer
} from 'lucide-react';

const NotificationIcon = ({ type, category, className = "w-5 h-5" }) => {
    // Priority 1: Category specific icons (Industrial context)
    if (category === 'ENERGY') return <Zap className={`${className} text-yellow-500`} />;
    if (category === 'SECURITY') return <ShieldAlert className={`${className} text-red-600`} />;
    if (category === 'SYSTEM' && type === 'CRITICAL') return <Thermometer className={`${className} text-red-500`} />;

    // Priority 2: Standard types
    switch (type) {
        case 'CRITICAL':
            return <XCircle className={`${className} text-red-600`} />;
        case 'WARNING':
            return <AlertTriangle className={`${className} text-amber-500`} />;
        case 'SUCCESS':
            return <CheckCircle className={`${className} text-green-500`} />;
        case 'INFO':
        default:
            return <Info className={`${className} text-blue-500`} />;
    }
};

export default NotificationIcon;
