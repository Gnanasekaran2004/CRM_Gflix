import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tv, CheckCircle, Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import gflixApi from '../api/gflixClient';

export default function RequestAccess() {
  const [step, setStep] = useState(1); // 1: form, 2: success
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', password: '', planId: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { data: plans = [] } = useQuery({
    queryKey: ['activePlans'],
    queryFn: () => gflixApi.get('/api/plans/active').then(r => r.data),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { ...form };
      if (form.planId) payload.requestedPlan = { id: Number(form.planId) };
      await gflixApi.post('/api/requests', payload);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 2) {
    return (
      <div style={{ minHeight: '100vh', background: '#141414', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', maxWidth: 480 }}>
          <CheckCircle size={72} color="#e50914" style={{ marginBottom: '1.5rem' }} />
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Request Submitted!</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem', lineHeight: 1.7 }}>
            Your request is under review. Our team will process it and you'll receive your login credentials once approved.
          </p>
          <button onClick={() => navigate('/login')} className="gflix-btn gflix-btn-red" style={{ padding: '0.875rem 3rem' }}>
            Back to Sign In
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#141414' }}>
      <header style={{ padding: '1.5rem 3rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
          <Tv size={26} color="#e50914" />
          <span style={{ fontSize: '1.625rem', fontWeight: 900, color: '#e50914', letterSpacing: '-1px' }}>GFLIX</span>
        </Link>
      </header>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '4rem 2rem' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '0.5rem' }}>Get Gflix Access</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2.5rem', fontSize: '1.05rem' }}>
            Choose your plan and submit a request. Our team will review and activate your account.
          </p>

          {/* Plan Selection */}
          {plans.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>Choose a Plan</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
                {plans.map(plan => (
                  <div
                    key={plan.id}
                    onClick={() => setForm(p => ({ ...p, planId: String(plan.id) }))}
                    style={{
                      border: `2px solid ${form.planId === String(plan.id) ? '#e50914' : 'rgba(255,255,255,0.1)'}`,
                      borderRadius: 10, padding: '1.25rem', cursor: 'pointer',
                      background: form.planId === String(plan.id) ? 'rgba(229,9,20,0.12)' : 'rgba(255,255,255,0.04)',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ fontSize: '1rem', fontWeight: 800 }}>{plan.name}</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#e50914', margin: '0.25rem 0' }}>${plan.monthlyPrice}<span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>/mo</span></div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{plan.videoQuality} · {plan.maxScreens} screen{plan.maxScreens > 1 ? 's' : ''}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div style={{ background: 'rgba(229,9,20,0.15)', border: '1px solid rgba(229,9,20,0.4)', borderRadius: 6, padding: '0.75rem 1rem', marginBottom: '1rem', color: '#ff6b72', fontSize: '0.875rem' }}>{error}</div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {[
              ['name', 'Full Name', 'text', true],
              ['email', 'Email Address', 'email', true],
              ['phone', 'Phone Number', 'tel', false],
              ['company', 'Company / Organization', 'text', false],
              ['password', 'Create Password', 'password', true],
            ].map(([field, placeholder, type, required]) => (
              <input
                key={field}
                type={type}
                className="gflix-input"
                placeholder={placeholder}
                value={form[field]}
                onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                required={required}
                minLength={field === 'password' ? 6 : undefined}
              />
            ))}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="gflix-btn gflix-btn-red"
              style={{ width: '100%', marginTop: '0.5rem', fontSize: '1.1rem' }}
            >
              {loading ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : null}
              {loading ? 'Submitting...' : 'Submit Request'}
            </motion.button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#fff', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </motion.div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
