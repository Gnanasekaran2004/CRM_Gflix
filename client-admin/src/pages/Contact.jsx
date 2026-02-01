import React from 'react';

import SpotlightCard from '../components/ui/SpotlightCard';

const Contact = () => {
    return (
        <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
            <h1>Contact Us</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
                Have questions? Reach out to us at support@sparkcrm.com
            </p>
            <SpotlightCard className="max-w-[400px] mx-auto p-8" spotlightColor="rgba(59, 130, 246, 0.2)">
                <div className="text-left">
                    <strong className="block mb-2 text-gray-900 dark:text-white">Mailing Address:</strong>
                    <div className="text-gray-600 dark:text-gray-300">
                        123 Innovation Drive<br />
                        Tech City, TC 90210
                    </div>
                </div>
            </SpotlightCard>
        </div>
    );
};

export default Contact;
