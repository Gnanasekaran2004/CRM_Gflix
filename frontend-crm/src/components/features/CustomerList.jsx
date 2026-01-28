import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import './CustomerList.css';

const CustomerList = ({ customers, onDelete }) => {
    return (
        <div className="list-container">
            <div className="list-header">
                <h3>Customer List</h3>
                <span className="badge">{customers.length} total</span>
            </div>

            <div className="table-wrapper">
                <table className="customer-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Company</th>
                            <th>Joined</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {customers.length > 0 ? (
                                customers.map((customer, index) => (
                                    <motion.tr
                                        key={customer.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ duration: 0.2, delay: index * 0.05 }}
                                    >
                                        <td className="id-cell">#{customer.id}</td>
                                        <td className="font-medium">
                                            {customer.name}
                                        </td>
                                        <td className="text-secondary">{customer.email}</td>
                                        <td className="text-secondary">{customer.phone || '-'}</td>
                                        <td>
                                            {customer.company ? (
                                                <span className="company-tag">{customer.company}</span>
                                            ) : (
                                                '-'
                                            )}
                                        </td>
                                        <td className="text-secondary">
                                            {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="text-right">
                                            <Button
                                                variant="danger"
                                                onClick={() => onDelete(customer.id)}
                                                className="btn-sm"
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="empty-state">
                                        No customers found.
                                    </td>
                                </tr>
                            )}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CustomerList;
