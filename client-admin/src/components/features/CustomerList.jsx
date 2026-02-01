import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import Input from '../ui/Input';
import SpotlightCard from '../ui/SpotlightCard';
import Modal from '../ui/Modal';
import './CustomerList.css';

const CustomerList = ({ customers, onDelete }) => {
    const [emailFilter, setEmailFilter] = useState('');
    const [phoneFilter, setPhoneFilter] = useState('');


    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);

    const [exitingIds, setExitingIds] = useState([]);

    const handleDeleteClick = (id) => {
        setCustomerToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (customerToDelete) {

            setExitingIds(prev => [...prev, customerToDelete]);

            setShowDeleteModal(false);
            setCustomerToDelete(null);

            setTimeout(() => {
                onDelete(customerToDelete);
            }, 500);
        }
    };

    const handleCloseModal = () => {
        setShowDeleteModal(false);
        setCustomerToDelete(null);
    };

    const filteredCustomers = customers.filter(customer => {
        const matchesEmail = customer.email.toLowerCase().includes(emailFilter.toLowerCase());
        const matchesPhone = customer.phone ? customer.phone.includes(phoneFilter) : false;


        if (!emailFilter && !phoneFilter) return true;
        if (emailFilter && !phoneFilter) return matchesEmail;
        if (!emailFilter && phoneFilter) return matchesPhone;
        return matchesEmail && matchesPhone;
    }).filter(c => !exitingIds.includes(c.id));
    return (
        <SpotlightCard className="list-container p-0" spotlightColor="rgba(255, 255, 255, 0.1)">
            <div className="list-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <h3>Customer List</h3>
                    <span className="badge">{filteredCustomers.length} found</span>
                </div>

                <div className="filter-bar">
                    <Input
                        placeholder="Filter by Email"
                        value={emailFilter}
                        onChange={(e) => setEmailFilter(e.target.value)}
                    />
                    <Input
                        placeholder="Search Phone"
                        value={phoneFilter}
                        onChange={(e) => setPhoneFilter(e.target.value)}
                    />
                </div>
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
                            {filteredCustomers.length > 0 ? (
                                filteredCustomers.map((customer, index) => (
                                    <motion.tr
                                        key={customer.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{
                                            opacity: 0,
                                            clipPath: "inset(0 100% 0 0)",
                                            transition: { duration: 0.4, ease: "easeInOut" }
                                        }}
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
                                                onClick={() => handleDeleteClick(customer.id)}
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

            <Modal
                show={showDeleteModal}
                onHide={handleCloseModal}
                title="Confirm Deletion"
                footer={
                    <>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </>
                }
            >
                <p>Are you sure you want to delete this customer?</p>
            </Modal>
        </SpotlightCard>
    );
};

export default CustomerList;
