import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Button from './components/ui/Button';
import Input from './components/ui/Input';
import SpotlightCard from './components/ui/SpotlightCard';
import { Link } from 'react-router-dom';
import { useTheme } from './contexts/ThemeContext';
import API_URL from './config';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { theme, toggleTheme } = useTheme();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const token = 'Basic ' + window.btoa(username + ":" + password);

        try {
            const apiUrl = API_URL;
            await axios.get(`${apiUrl}/api/auth/me`, {
                headers: { 'Authorization': token }
            });
            localStorage.setItem('username', username);
            onLogin(token);
        } catch (err) {
            console.error(err);
            let errorMessage = "Invalid credentials. Please try again.";
            if (err.response) {
                if (err.response.status === 401) {
                    errorMessage = "Invalid username or password.";
                } else if (err.response.data && typeof err.response.data === 'string') {
                    errorMessage = err.response.data;
                }
            } else if (err.request) {
                errorMessage = "Cannot reach the server. Is the backend running?";
            } else {
                errorMessage = err.message;
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 overflow-hidden relative">
            <button
                onClick={toggleTheme}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 dark:bg-black/10 dark:hover:bg-black/20 text-gray-700 dark:text-gray-200 transition-colors z-20 backdrop-blur-sm"
                aria-label="Toggle Theme">
                {theme === 'dark' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                    </svg>
                )}
            </button>

            <div style={{
                position: 'absolute',
                top: '-10%',
                right: '-5%',
                width: '500px',
                height: '500px',
                background: 'var(--primary-200)',
                filter: 'blur(80px)',
                borderRadius: '50%',
                opacity: 0.5,
                zIndex: 0
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-10%',
                left: '-10%',
                width: '600px',
                height: '600px',
                background: 'var(--primary-300)',
                filter: 'blur(100px)',
                borderRadius: '50%',
                opacity: 0.3,
                zIndex: 0
            }} />

            <SpotlightCard className="w-full max-w-[400px] z-10 shadow-xl" spotlightColor="rgba(99, 102, 241, 0.25)">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', className: 'text-gradient' }}>Welcome Back</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Sign in to access your CRM</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            style={{
                                backgroundColor: '#FEF2F2',
                                color: '#DC2626',
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-md)',
                                marginBottom: '1.5rem',
                                fontSize: '0.875rem',
                                border: '1px solid #FCA5A5'
                            }}
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Input
                            label="Username"
                            placeholder="Enter your username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                        />
                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />

                        <div style={{ marginTop: '2rem' }}>
                            <Button
                                type="submit"
                                variant="primary"
                                fullWidth
                                size="lg"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Logging in...' : 'Log In'}
                            </Button>
                        </div>
                    </form>

                    <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        <span>Don't have an account? <Link to="/register" style={{ color: 'var(--primary-600)', fontWeight: '600' }}>Sign Up</Link></span>
                    </div>
                </motion.div>
            </SpotlightCard>
        </div>
    );
}

export default Login;