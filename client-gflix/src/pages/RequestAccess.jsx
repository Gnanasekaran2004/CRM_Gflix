import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import API_URL from '../config';

const RequestAccess = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        password: ''
    });
    const [status, setStatus] = useState('idle');
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const apiBaseUrl = API_URL;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMsg('');

        try {
            await axios.post(`${apiBaseUrl}/api/requests`, formData);
            setStatus('success');
            setTimeout(() => navigate('/login'), 3000);
        } catch (error) {
            console.error(error);
            setStatus('error');
            setErrorMsg('Failed to submit request. Please try again.');
        }
    };

    if (status === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black bg-opacity-90 bg-[url('https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg')] bg-cover bg-blend-overlay">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-black/80 p-8 rounded-lg max-w-md text-center border border-gray-700"
                >
                    <h2 className="text-2xl text-green-500 font-bold mb-4">Request Submitted!</h2>
                    <p className="text-gray-300">Your access request has been sent to the administrator.</p>
                    <p className="text-gray-400 mt-2 text-sm">You will be able to log in once approved.</p>
                    <p className="text-gray-500 mt-4 text-xs">Redirecting to login...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black bg-opacity-50 bg-[url('https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg')] bg-cover bg-blend-overlay">
            <div className="absolute top-0 left-0 w-full p-6">
                <h1 className="text-red-600 text-4xl font-bold uppercase tracking-tighter">Gflix</h1>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/75 p-12 rounded-lg w-full max-w-md min-h-[500px]"
            >
                <h2 className="text-3xl font-bold text-white mb-8">Request Access</h2>

                {status === 'error' && (
                    <div className="bg-orange-500/20 border border-orange-500 text-orange-500 p-3 rounded mb-4 text-sm">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="p-4 bg-[#333] rounded text-white placeholder-gray-500 focus:outline-none focus:bg-[#454545]"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="p-4 bg-[#333] rounded text-white placeholder-gray-500 focus:outline-none focus:bg-[#454545]"
                    />
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        className="p-4 bg-[#333] rounded text-white placeholder-gray-500 focus:outline-none focus:bg-[#454545]"
                    />
                    <input
                        type="text"
                        name="company"
                        placeholder="Company (Optional)"
                        value={formData.company}
                        onChange={handleChange}
                        className="p-4 bg-[#333] rounded text-white placeholder-gray-500 focus:outline-none focus:bg-[#454545]"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Desired Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="p-4 bg-[#333] rounded text-white placeholder-gray-500 focus:outline-none focus:bg-[#454545]"
                    />

                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="bg-[#e50914] text-white font-bold py-3 rounded mt-6 hover:bg-[#f6121d] transition-colors disabled:opacity-50"
                    >
                        {status === 'loading' ? 'Submitting...' : 'Request Access'}
                    </button>
                </form>

                <div className="mt-8 text-gray-400 text-sm">
                    Already approved? <Link to="/login" className="text-white hover:underline">Sign in now.</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default RequestAccess;
