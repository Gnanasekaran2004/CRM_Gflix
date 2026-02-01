import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const result = await login(email, password);
        if (result.success) {
            navigate('/browse');
        } else {
            setError(result.message || 'Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black bg-opacity-50 bg-[url('https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg')] bg-cover bg-blend-overlay">
            <div className="absolute top-0 left-0 w-full p-6 cursor-pointer" onClick={() => navigate('/')}>
                <h1 className="text-red-600 text-4xl font-bold uppercase tracking-tighter">Gflix</h1>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-black/75 p-16 rounded-lg w-full max-w-[450px] min-h-[600px]"
            >
                <h2 className="text-3xl font-bold text-white mb-8">Sign In</h2>

                {error && (
                    <div className="bg-[#e87c03] p-3 rounded mb-4 text-white text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="p-4 bg-[#333] rounded text-white placeholder-gray-500 focus:outline-none focus:bg-[#454545]"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="p-4 bg-[#333] rounded text-white placeholder-gray-500 focus:outline-none focus:bg-[#454545]"
                    />

                    <button
                        type="submit"
                        className="bg-[#e50914] text-white font-bold py-3 rounded mt-6 hover:bg-[#f6121d] transition-colors"
                    >
                        Sign In
                    </button>
                </form>

                <div className="mt-4 flex justify-between text-gray-400 text-sm">
                    <label className="flex items-center gap-1 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 bg-[#333] border-0 rounded-sm" /> Remember me
                    </label>
                    <a href="#" className="hover:underline">Need help?</a>
                </div>

                <div className="mt-16 text-gray-400">
                    New here? <Link to="/request" className="text-white hover:underline">Request access now.</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
