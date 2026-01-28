import React from 'react';

const Contact = () => {
    return (
        <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
            <h1>Contact Us</h1>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
                Have questions? Reach out to us at support@sparkcrm.com
            </p>
            <div style={{
                background: '#f9fafb',
                padding: '2rem',
                borderRadius: '8px',
                maxWidth: '400px',
                margin: '0 auto',
                border: '1px solid #e5e7eb'
            }}>
                <strong>Mailing Address:</strong><br />
                123 Innovation Drive<br />
                Tech City, TC 90210
            </div>
        </div>
    );
};

export default Contact;
