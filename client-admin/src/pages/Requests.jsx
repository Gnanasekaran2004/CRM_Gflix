import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SpotlightCard from '../components/ui/SpotlightCard';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';

const Requests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    const authToken = localStorage.getItem('authToken');

    const fetchRequests = async () => {
        try {
            const response = await axios.get(`${apiBaseUrl}/api/requests`, {
                headers: { 'Authorization': authToken }
            });
            const pending = response.data.filter(r => r.status === 'PENDING');
            setRequests(pending);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching requests", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleApprove = async (id) => {
        try {
            await axios.post(`${apiBaseUrl}/api/requests/${id}/approve`, {}, {
                headers: { 'Authorization': authToken }
            });
            fetchRequests();
        } catch (error) {
            console.error("Error approving request", error);
            alert("Failed to approve request");
        }
    };

    const handleReject = async (id) => {
        if (!confirm("Are you sure you want to reject this request?")) return;
        try {
            await axios.post(`${apiBaseUrl}/api/requests/${id}/reject`, {}, {
                headers: { 'Authorization': authToken }
            });
            fetchRequests();
        } catch (error) {
            console.error("Error rejecting request", error);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container py-8"
        >
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Access Requests</h1>
                <p className="text-gray-600 dark:text-gray-400">Review and approve requests for the Gflix app.</p>
            </div>

            {loading ? (
                <div className="text-center py-12">Loading...</div>
            ) : requests.length === 0 ? (
                <SpotlightCard className="p-12 text-center">
                    <h3 className="text-xl font-semibold mb-2">No Pending Requests</h3>
                    <p className="text-gray-500">All caught up! Check back later.</p>
                </SpotlightCard>
            ) : (
                <div className="grid gap-4">
                    <AnimatePresence>
                        {requests.map((req) => (
                            <motion.div
                                key={req.id}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <SpotlightCard className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-lg font-bold">{req.name}</h3>
                                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full dark:bg-yellow-900/30 dark:text-yellow-500">Pending</span>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{req.email} • {req.phone || 'No Phone'}</p>
                                        <p className="text-sm mt-1">{req.company || 'No Company'}</p>
                                        <p className="text-xs text-gray-400 mt-2">Requested: {new Date(req.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => handleReject(req.id)}
                                            variant="outline"
                                            className="text-red-500 border-red-200 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/20"
                                        >
                                            Reject
                                        </Button>
                                        <Button
                                            onClick={() => handleApprove(req.id)}
                                            className="bg-green-600 hover:bg-green-700 text-white"
                                        >
                                            Approve Access
                                        </Button>
                                    </div>
                                </SpotlightCard>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </motion.div>
    );
};

export default Requests;