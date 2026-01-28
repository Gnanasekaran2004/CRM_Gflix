import React from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import './CustomerForm.css';

const CustomerForm = ({ formData, handleChange, handleSubmit }) => {
    return (
        <div className="form-container">
            <div className="form-header">
                <h3>Add New Customer</h3>
                <p>Enter the details of the new customer below.</p>
            </div>
            <form onSubmit={handleSubmit} className="customer-form">
                <div className="form-grid">
                    <Input
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. John"
                        required
                    />
                    <Input
                        label="Email Address"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                    />
                    <Input
                        label="Phone Number"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g. +1 234 567 8900"
                    />
                    <Input
                        label="Company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="e.g. Acme Corp"
                    />
                </div>
                <div className="form-actions">
                    <Button type="submit" variant="primary">
                        Save Customer
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CustomerForm;
