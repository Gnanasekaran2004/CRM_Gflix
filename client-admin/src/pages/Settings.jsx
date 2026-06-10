import React from 'react';
import { motion } from 'framer-motion';
import { Shield, User, Bell, Database, Palette, RefreshCw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import useAuthStore from '../store/authStore';
import api from '../api/client';

const fadeIn = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function Settings() {
  const { user } = useAuthStore();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => api.get('/api/dashboard/stats').then(r => r.data),
    refetchInterval: 30000,
  });

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['adminProfile'],
    queryFn: () => api.get('/api/auth/me').then(r => r.data),
  });

  const displayUser = profile || user;

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08 } } }}>
      <motion.div variants={fadeIn} className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your account and platform preferences</p>
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        <motion.div variants={fadeIn} className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <User size={18} color="#6366f1" />
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9' }}>Profile Information</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.5rem', fontWeight: 800, color: 'white',
            }}>
              {(displayUser?.fullName || displayUser?.username || 'A').charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '1rem' }}>{displayUser?.fullName || displayUser?.username}</div>
              <div style={{ fontSize: '0.8rem', color: '#6366f1', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {displayUser?.role?.replace('_', ' ')}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: 2 }}>{displayUser?.email}</div>
            </div>
          </div>
          {[
            ['Username', displayUser?.username],
            ['Email', displayUser?.email],
            ['Full Name', displayUser?.fullName],
            ['Role', displayUser?.role?.replace('_', ' ')],
            ['User Type', displayUser?.userType || 'ADMIN'],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid rgba(99,102,241,0.08)', fontSize: '0.875rem' }}>
              <span style={{ color: '#64748b' }}>{label}</span>
              <span style={{ color: '#f1f5f9', fontWeight: 500 }}>{profileLoading ? '...' : (value || '—')}</span>
            </div>
          ))}
        </motion.div>

        <motion.div variants={fadeIn} className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Shield size={18} color="#10b981" />
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9' }}>Security</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { label: 'Two-Factor Authentication', status: 'Disabled', color: '#ef4444' },
              { label: 'Session Timeout', status: '24 hours', color: '#10b981' },
              { label: 'JWT Token Type', status: 'Bearer', color: '#6366f1' },
              { label: 'Password Encryption', status: 'BCrypt', color: '#10b981' },
            ].map(({ label, status, color }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(30,42,69,0.5)', borderRadius: 10, fontSize: '0.875rem' }}>
                <span style={{ color: '#94a3b8' }}>{label}</span>
                <span style={{ color, fontWeight: 600, fontSize: '0.8rem' }}>{status}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeIn} className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Database size={18} color="#f59e0b" />
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9' }}>Live System Stats</h2>
            <RefreshCw size={12} color="#475569" style={{ marginLeft: 'auto', animation: 'spin 3s linear infinite' }} />
          </div>
          {[
            ['Total Customers', statsLoading ? '...' : stats?.totalCustomers ?? 0],
            ['Active Subscribers', statsLoading ? '...' : stats?.activeCustomers ?? 0],
            ['Trial Users', statsLoading ? '...' : stats?.trialCustomers ?? 0],
            ['Open Tickets', statsLoading ? '...' : stats?.openTickets ?? 0],
            ['Pending Requests', statsLoading ? '...' : stats?.pendingRequests ?? 0],
            ['Monthly Revenue', statsLoading ? '...' : `$${Math.round(stats?.mrr || 0).toLocaleString()}`],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 0', borderBottom: '1px solid rgba(99,102,241,0.08)', fontSize: '0.875rem' }}>
              <span style={{ color: '#64748b' }}>{label}</span>
              <span style={{ color: '#94a3b8', fontWeight: 600 }}>{value}</span>
            </div>
          ))}
          <div style={{ fontSize: '0.7rem', color: '#374151', marginTop: '0.75rem' }}>Auto-refreshes every 30s</div>
        </motion.div>

        <motion.div variants={fadeIn} className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Palette size={18} color="#8b5cf6" />
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9' }}>System Information</h2>
          </div>
          {[
            ['Platform', 'NexCRM v1.0.0'],
            ['Backend', 'Spring Boot 3.2.5'],
            ['Database', 'H2 (Dev) / PostgreSQL (Prod)'],
            ['Auth', 'JWT HS256'],
            ['Frontend', 'React 18 + Vite'],
            ['API Polling', '10–30s intervals'],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 0', borderBottom: '1px solid rgba(99,102,241,0.08)', fontSize: '0.875rem' }}>
              <span style={{ color: '#64748b' }}>{label}</span>
              <span style={{ color: '#94a3b8', fontWeight: 500 }}>{value}</span>
            </div>
          ))}
          <div style={{ marginTop: '1.25rem', padding: '0.875rem', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'linear-gradient(135deg, #0a0d14, #1e2a45)', border: '2px solid #6366f1', flexShrink: 0 }} />
              <span style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '0.875rem' }}>Dark Mode (Active)</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>NexCRM uses a premium dark theme optimized for long work sessions and data-heavy interfaces.</p>
          </div>
        </motion.div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </motion.div>
  );
}
