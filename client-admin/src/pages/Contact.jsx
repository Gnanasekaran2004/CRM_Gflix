import React from 'react';

import SpotlightCard from '../components/ui/SpotlightCard';

const Contact = () => {
    return (
        <div className="container mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent">Get in Touch</h1>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                <SpotlightCard className="p-8 h-full" spotlightColor="rgba(34, 197, 94, 0.2)">
                    <h3 className="text-xl font-bold mb-4 dark:text-white">Contact Information</h3>
                    <div className="space-y-4">
                        <div>
                            <span className="block text-xs text-gray-400 uppercase tracking-wider">Phone</span>
                            <a href="tel:+918248094569" className="text-lg text-gray-700 dark:text-gray-200 hover:text-green-500 transition-colors">
                                (+91) 8248094569
                            </a>
                        </div>
                        <div>
                            <span className="block text-xs text-gray-400 uppercase tracking-wider">Email</span>
                            <a href="mailto:sgnana238@gmail.com" className="text-lg text-gray-700 dark:text-gray-200 hover:text-green-500 transition-colors">
                                sgnana238@gmail.com
                            </a>
                        </div>
                        <div>
                            <span className="block text-xs text-gray-400 uppercase tracking-wider">Location</span>
                            <p className="text-lg text-gray-700 dark:text-gray-200">
                                Vellore, India
                            </p>
                        </div>
                    </div>
                </SpotlightCard>

                <SpotlightCard className="p-8 h-full" spotlightColor="rgba(59, 130, 246, 0.2)">
                    <h3 className="text-xl font-bold mb-4 dark:text-white">Professional Profiles</h3>
                    <div className="space-y-4">
                        <a href="https://linkedin.com/in/gnana-sekaran-20041025gs" target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                            <span className="font-semibold text-blue-600">LinkedIn</span>
                            <span className="text-gray-600 dark:text-gray-400 text-sm">gnana-sekaran-20041025gs</span>
                        </a>
                        <a href="https://github.com/Gnanasekaran2004" target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                            <span className="font-semibold text-gray-900 dark:text-white">GitHub</span>
                            <span className="text-gray-600 dark:text-gray-400 text-sm">Gnanasekaran2004</span>
                        </a>
                    </div>
                </SpotlightCard>
            </div>
        </div>
    );
};

export default Contact;
