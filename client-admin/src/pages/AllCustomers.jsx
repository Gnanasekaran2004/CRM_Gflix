import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomerList from '../components/features/CustomerList';
import { motion } from 'framer-motion';
import API_URL from '../config';

const AllCustomers = () => {
    const [customers, setCustomers] = useState([]);

    const apiBaseUrl = `${API_URL}/api/customers`;


    const authToken = localStorage.getItem('authToken');

    const getHeaders = () => {
        return { headers: { 'Authorization': authToken } };
    };

    const fetchCustomers = () => {
        if (!authToken) return;
        axios.get(apiBaseUrl, getHeaders())
            .then(response => setCustomers(response.data))
            .catch(error => console.error("Error fetching data:", error));
    };

    useEffect(() => {
        fetchCustomers();
    }, [authToken]);

    const handleDelete = (id) => {
        axios.delete(`${apiBaseUrl}/${id}`, getHeaders())
            .then(() => {
                setCustomers(customers.filter(c => c.id !== id));
            })
            .catch(error => console.error("Error deleting customer:", error));
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container"
            style={{ padding: '2rem 1.5rem' }}
        >
            <h1 style={{ marginBottom: '2rem', fontSize: '1.875rem' }}>All Customers</h1>
            <CustomerList
                customers={customers}
                onDelete={handleDelete}
            />
        </motion.div>
    );
};

export default AllCustomers;
