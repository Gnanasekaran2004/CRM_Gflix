import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, Tv } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import gflixApi from '../api/gflixClient';
import useCustomerAuthStore from '../store/customerAuthStore';

export default function GflixLogin() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useCustomerAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await gflixApi.post('/api/customer-auth/login', form);
      login(data);
      navigate('/browse');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://assets.nflxext.com/ffe/siteui/vlv3/fc541a04-2d8b-4ed0-b4f3-e2a7e7e2e72f/3e45e2d2-a2b5-4f58-8c0e-81d19b8f4b57/IN-en-20240205-popsignuptwoweeks-perspective_alpha_website_medium.jpg") center/cover no-repeat',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <header style={{ padding: '1.5rem 3rem', display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <img src="/logo.png" alt="PulseStream Logo" style={{ height: '36px' }} />
          <span style={{ fontSize: '1.875rem', fontWeight: 900, color: '#e50914', letterSpacing: '-1px' }}>PulseStream</span>
        </div>
      </header>

      {/* Card */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(0,0,0,0.82)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8,
            padding: '3rem',
            width: '100%',
            maxWidth: 450,
          }}
        >
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.75rem' }}>Sign In</h1>

          {/* Demo hint */}
          <div style={{ background: 'rgba(229,9,20,0.12)', border: '1px solid rgba(229,9,20,0.3)', borderRadius: 6, padding: '0.75rem 1rem', marginBottom: '1.5rem', fontSize: '0.8rem', color: '#ff6b72' }}>
            <strong>Demo:</strong> emma@techcorp.com / pass123
          </div>

          {error && (
            <div style={{ background: 'rgba(229,9,20,0.15)', border: '1px solid rgba(229,9,20,0.4)', borderRadius: 6, padding: '0.75rem 1rem', marginBottom: '1rem', color: '#ff6b72', fontSize: '0.875rem' }}>{error}</div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input
              type="email"
              className="pulse-input"
              placeholder="Email address"
              value={form.username}
              onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
              required
              autoFocus
            />
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                className="pulse-input"
                placeholder="Password"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                required
                style={{ paddingRight: '3rem' }}
              />
              <button type="button" onClick={() => setShowPass(p => !p)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="pulse-btn pulse-btn-red"
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              {loading ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : null}
              {loading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
            New to PulseStream?{' '}
            <Link to="/request-access" style={{ color: '#fff', fontWeight: 600, textDecoration: 'none' }}>Request access</Link>
          </p>
        </motion.div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
