import React, { useState } from 'react';
import axios from 'axios';
import Button from '../ui/Button';
import Input from '../ui/Input';
import SpotlightCard from '../ui/SpotlightCard';
import API_URL from '../../config';
import { Send, AlertTriangle } from 'lucide-react';

const BroadcastPanel = () => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [type, setType] = useState('INFO');
    const [sending, setSending] = useState(false);
    const [status, setStatus] = useState('');

    const handleSend = async (e) => {
        e.preventDefault();
        setSending(true);
        setStatus('');

        try {
            const token = localStorage.getItem('authToken');
            await axios.post(`${API_URL}/api/notifications/send`, {
                title,
                message,
                type,
                priority: type === 'CRITICAL' ? 'HIGH' : 'NORMAL',
                category: 'SYSTEM',
                triggeredBy: 'admin'
            }, {
                headers: { 'Authorization': token }
            });
            setStatus('Broadcast sent successfully!');
            setTitle('');
            setMessage('');
            setTimeout(() => setStatus(''), 3000);
        } catch (error) {
            console.error(error);
            setStatus('Failed to send broadcast.');
        } finally {
            setSending(false);
        }
    };

    return (
        <SpotlightCard className="p-6 h-full" spotlightColor="rgba(239, 68, 68, 0.15)">
            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="text-xl font-bold dark:text-white">System Broadcast</h3>
            </div>

            <form onSubmit={handleSend} className="space-y-4">
                <div>
                    <label htmlFor="broadcastTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Alert Title
                    </label>
                    <Input
                        id="broadcastTitle"
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., System Maintenance"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="broadcastMessage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Message Body
                    </label>
                    <textarea
                        id="broadcastMessage"
                        name="message"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none h-24"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Enter detailed message..."
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Severity Level
                    </label>
                    <div className="flex gap-2">
                        {['INFO', 'WARNING', 'CRITICAL', 'SUCCESS'].map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setType(t)}
                                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors border ${type === t
                                    ? 'bg-blue-500 border-blue-500 text-white'
                                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {status && (
                    <div className={`text-sm ${status.includes('Failed') ? 'text-red-500' : 'text-green-500'}`}>
                        {status}
                    </div>
                )}

                <Button
                    type="submit"
                    variant={type === 'CRITICAL' ? 'danger' : 'primary'}
                    className="w-full flex justify-center items-center gap-2"
                    disabled={sending}
                >
                    <Send className="w-4 h-4" />
                    {sending ? 'Sending...' : 'Broadcast Alert'}
                </Button>
            </form>
        </SpotlightCard>
    );
};

export default BroadcastPanel;
