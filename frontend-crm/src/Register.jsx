import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Button from './components/ui/Button';
import Input from './components/ui/Input';
import { Link } from 'react-router-dom';

function Register({ onRegister }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        setIsLoading(true);

        try {
            await axios.post('http://localhost:8081/api/auth/register', {
                username,
                password,
                roles: 'USER'
            });
            setSuccess("Registration successful! You can now log in.");
            setUsername('');
            setPassword('');
            setConfirmPassword('');
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data) {
                setError(err.response.data);
            } else {
                setError("Registration failed. Please try again.");
            }
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

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
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
                    <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', className: 'text-gradient' }}>Create Account</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Sign up to get started</p>
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

                {success && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        style={{
                            backgroundColor: '#ECFDF5',
                            color: '#059669',
                            padding: '0.75rem',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: '1.5rem',
                            fontSize: '0.875rem',
                            border: '1px solid #6EE7B7'
                        }}
                    >
                        {success}
                        <div style={{ marginTop: '0.5rem' }}>
                            <Link to="/" style={{ fontWeight: '600', textDecoration: 'underline' }}>Go to Login</Link>
                        </div>
                    </motion.div>
                )}

                {!success && (
                    <form onSubmit={handleSubmit}>
                        <Input
                            label="Username"
                            placeholder="Choose a username"
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
                        <Input
                            label="Confirm Password"
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
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
                                {isLoading ? 'Creating Account...' : 'Sign Up'}
                            </Button>
                        </div>
                    </form>
                )}

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <span>Already have an account? <Link to="/" style={{ color: 'var(--primary-600)', fontWeight: '600' }}>Log In</Link></span>
                </div>
            </motion.div>
        </div>
    );
}

export default Register;
