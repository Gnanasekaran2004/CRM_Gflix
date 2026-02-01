import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomerForm from '../components/features/CustomerForm';
import CustomerList from '../components/features/CustomerList';
import SpotlightCard from '../components/ui/SpotlightCard';
import { motion } from 'framer-motion';
import API_URL from '../config';

const Home = () => {
    const [recentCustomers, setRecentCustomers] = useState([]);
    const [stats, setStats] = useState({ total: 0, newThisWeek: 0 });
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: ''
    });

    const apiBaseUrl = `${API_URL}/api/customers`;

    const authToken = localStorage.getItem('authToken');
    const getHeaders = () => {
        return { headers: { 'Authorization': authToken } };
    };

    const fetchRecentCustomers = () => {
        if (!authToken) return;

        axios.get(`${apiBaseUrl}/recent`, getHeaders())
            .then(response => {
                setRecentCustomers(response.data);
                setStats({
                    total: response.data.length,
                    newThisWeek: response.data.length
                });
            })
            .catch(error => {
                console.error("Error fetching recent customers:", error);
            });
    };

    useEffect(() => {
        fetchRecentCustomers();
    }, [authToken]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(apiBaseUrl, formData, getHeaders())
            .then(response => {
                fetchRecentCustomers();
                setFormData({ name: '', email: '', phone: '', company: '' });
            })
            .catch(error => console.error("Error adding customer:", error));
    };

    const handleDelete = (id) => {
        axios.delete(`${apiBaseUrl}/${id}`, getHeaders())
            .then(() => {
                fetchRecentCustomers();
            })
            .catch(error => console.error("Error deleting customer:", error));
    };

    const getUsername = () => {
        const storedName = localStorage.getItem('username');
        if (storedName) return storedName;
        const token = localStorage.getItem('authToken');
        if (token && token.startsWith('Basic ')) {
            try {
                const decoded = atob(token.split(' ')[1]);
                return decoded.split(':')[0];
            } catch (e) {
                console.error("Failed to decode token", e);
            }
        }
        return 'User';
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container"
            style={{ paddingBottom: '2rem', paddingTop: '2rem' }}
        >
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>Dashboard</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {getUsername()}</p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2.5rem'
            }}>
                <SpotlightCard spotlightColor="rgba(79, 70, 229, 0.2)">
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Total Customers</p>
                    <h3 style={{ fontSize: '2rem', color: 'var(--primary-600)' }}>{stats.total}</h3>
                </SpotlightCard>
                <SpotlightCard spotlightColor="rgba(16, 185, 129, 0.2)">
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>New This Week</p>
                    <h3 style={{ fontSize: '2rem', color: 'var(--accent-600)' }}>+{stats.newThisWeek}</h3>
                </SpotlightCard>
                <SpotlightCard spotlightColor="rgba(245, 158, 11, 0.2)">
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Pending Actions</p>
                    <h3 style={{ fontSize: '2rem', color: 'var(--warning-500)' }}>0</h3>
                </SpotlightCard>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem', alignItems: 'start' }}>

                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.25rem' }}>Recent Activity</h2>
                    </div>
                    <CustomerList
                        customers={recentCustomers}
                        onDelete={handleDelete}
                    />
                </div>


                <div style={{ position: 'sticky', top: '5rem' }}>
                    <CustomerForm
                        formData={formData}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default Home;
