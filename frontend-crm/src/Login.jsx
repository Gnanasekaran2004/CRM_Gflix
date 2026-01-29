import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Button from './components/ui/Button';
import Input from './components/ui/Input';
import { Link } from 'react-router-dom';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const token = 'Basic ' + window.btoa(username + ":" + password);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8081';
            await axios.get(`${apiUrl}/api/auth/me`, {
                headers: { 'Authorization': token }
            });
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
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, var(--primary-100) 0%, var(--primary-50) 100%)',
            position: 'relative',
            overflow: 'hidden'
        }}>

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

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-panel"
                style={{
                    width: '100%',
                    maxWidth: '400px',
                    padding: '2.5rem',
                    borderRadius: 'var(--radius-xl)',
                    position: 'relative',
                    zIndex: 1,
                    boxShadow: 'var(--shadow-xl)'
                }}
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
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </div>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <span style={{ opacity: 0.7, display: 'block', marginBottom: '0.5rem' }}>Demo: admin / password123</span>
                    <span>Don't have an account? <Link to="/register" style={{ color: 'var(--primary-600)', fontWeight: '600' }}>Sign Up</Link></span>
                </div>
            </motion.div>
        </div>
    );
}

export default Login;