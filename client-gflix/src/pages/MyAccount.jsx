import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Tv, ArrowLeft, User, CreditCard, Shield, Calendar, Download, Monitor, Wifi, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import gflixApi from '../api/gflixClient';
import useCustomerAuthStore from '../store/customerAuthStore';

export default function MyAccount() {
  const { customer } = useCustomerAuthStore();
  const [activeTab, setActiveTab] = useState('profile');

  const { data: profile, isLoading } = useQuery({
    queryKey: ['customerProfile'],
    queryFn: () => gflixApi.get('/api/customer-auth/me').then(r => r.data),
    refetchInterval: 30000,
  });

  const { data: tickets = [] } = useQuery({
    queryKey: ['myTickets'],
    queryFn: () => gflixApi.get(`/api/tickets/customer/${profile?.id}`).then(r => r.data),
    enabled: !!profile?.id,
    refetchInterval: 30000,
  });

  const statusColor = { ACTIVE: '#10b981', TRIAL: '#f59e0b', CHURNED: '#ef4444', PAUSED: '#64748b', EXPIRED: '#64748b' };
  const statusLabel = { ACTIVE: 'Active', TRIAL: 'Trial', CHURNED: 'Cancelled', PAUSED: 'Paused', EXPIRED: 'Expired' };
  const ticketStatusColor = { OPEN: '#3b82f6', IN_PROGRESS: '#f59e0b', RESOLVED: '#10b981', CLOSED: '#64748b' };

  return (
    <div style={{ background: '#141414', minHeight: '100vh' }}>
      <header style={{ padding: '1.25rem 3rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/browse" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
          <img src="/logo.png" alt="PulseStream Logo" style={{ height: '24px' }} />
          <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#e50914' }}>PulseStream</span>
        </Link>
        <Link to="/browse" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.875rem' }}>
          <ArrowLeft size={16} /> Back to Browse
        </Link>
      </header>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '2rem' }}>Account</h1>

        {isLoading ? (
          <div style={{ height: 120, background: 'rgba(255,255,255,0.05)', borderRadius: 12, marginBottom: '2rem' }} />
        ) : (
          <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #e50914, #8b0000)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 900, flexShrink: 0 }}>
              {(profile?.name || 'G').charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{profile?.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>{profile?.email}</div>
              {profile?.company && <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: 2 }}>{profile.company}</div>}
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{
                background: `${statusColor[profile?.subscriptionStatus] || '#64748b'}20`,
                color: statusColor[profile?.subscriptionStatus] || '#64748b',
                border: `1px solid ${statusColor[profile?.subscriptionStatus] || '#64748b'}40`,
                padding: '0.375rem 1rem', borderRadius: 99, fontSize: '0.8rem', fontWeight: 700,
              }}>
                {statusLabel[profile?.subscriptionStatus] || profile?.subscriptionStatus}
              </span>
              {profile?.plan && (
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.375rem' }}>
                  {profile.plan.name} Plan
                </div>
              )}
            </div>
          </div>
        )}

        {profile?.subscriptionStatus === 'CHURNED' && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.25rem' }}>⚠️</span>
            <div>
              <div style={{ fontWeight: 700, color: '#f87171', fontSize: '0.9rem' }}>Subscription Cancelled</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>Your subscription has been cancelled. Contact support to reactivate.</div>
            </div>
            <Link to="/support" style={{ marginLeft: 'auto', color: '#e50914', fontWeight: 700, textDecoration: 'none', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
              Contact Support →
            </Link>
          </motion.div>
        )}

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {[['profile', User, 'Profile'], ['plan', CreditCard, 'Subscription'], ['tickets', Shield, 'Support Tickets']].map(([tab, Icon, label]) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.625rem 1.25rem', borderRadius: 6, border: 'none', cursor: 'pointer',
                background: activeTab === tab ? 'rgba(229,9,20,0.2)' : 'rgba(255,255,255,0.05)',
                color: activeTab === tab ? '#fff' : 'rgba(255,255,255,0.5)',
                fontWeight: activeTab === tab ? 700 : 500, fontSize: '0.875rem',
                fontFamily: 'Inter, sans-serif',
              }}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {activeTab === 'profile' && profile && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              ['Full Name', profile.name],
              ['Email', profile.email],
              ['Phone', profile.phone || '—'],
              ['Company', profile.company || '—'],
              ['Country', profile.country || '—'],
              ['City', profile.city || '—'],
              ['Billing Cycle', profile.billingCycle || '—'],
              ['Member Since', profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'],
            ].map(([label, value]) => (
              <div key={label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '1rem 1.25rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.375rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
                <div style={{ fontWeight: 600 }}>{value}</div>
              </div>
            ))}
            {profile.subscriptionStartDate && (
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '1rem 1.25rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.375rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Subscription Start</div>
                <div style={{ fontWeight: 600 }}>{new Date(profile.subscriptionStartDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'plan' && profile && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {profile.plan ? (
              <div style={{ background: 'rgba(229,9,20,0.08)', border: '1px solid rgba(229,9,20,0.2)', borderRadius: 16, padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#e50914', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Current Plan</div>
                    <div style={{ fontSize: '2rem', fontWeight: 900 }}>{profile.plan.name}</div>
                    {profile.plan.description && (
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', marginTop: '0.5rem' }}>{profile.plan.description}</div>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: '#e50914' }}>
                      ${profile.billingCycle === 'ANNUAL' ? profile.plan.annualPrice : profile.plan.monthlyPrice}
                      <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)' }}>/{profile.billingCycle === 'ANNUAL' ? 'yr' : 'mo'}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>
                      {profile.billingCycle === 'ANNUAL' ? `$${(profile.plan.annualPrice / 12).toFixed(2)}/mo equivalent` : `$${(profile.plan.annualPrice || 0).toFixed(2)}/yr if annual`}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                  {[
                    [Monitor, `${profile.plan.videoQuality} Quality`, true],
                    [Monitor, `${profile.plan.maxScreens} simultaneous screen${profile.plan.maxScreens > 1 ? 's' : ''}`, true],
                    [Download, 'Downloads included', profile.plan.downloadAllowed],
                    [Wifi, 'Offline viewing', profile.plan.offlineViewing],
                  ].map(([Icon, label, enabled], i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '0.625rem',
                      background: enabled ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
                      padding: '0.75rem 1rem', borderRadius: 10, fontSize: '0.85rem',
                      color: enabled ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.3)',
                    }}>
                      <Icon size={16} color={enabled ? '#e50914' : 'rgba(255,255,255,0.2)'} />
                      {label}
                    </div>
                  ))}
                </div>
                {profile.subscriptionStartDate && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                    <Calendar size={14} />
                    Active since {new Date(profile.subscriptionStartDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.3)' }}>
                <CreditCard size={48} style={{ marginBottom: '1rem' }} />
                <p>No active plan. Contact support to get started.</p>
                <Link to="/support" style={{ color: '#e50914', fontWeight: 600, marginTop: '1rem', display: 'inline-block', textDecoration: 'none' }}>
                  Contact Support →
                </Link>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'tickets' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {tickets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.3)' }}>
                <Shield size={48} style={{ marginBottom: '1rem' }} />
                <p>No support tickets yet.</p>
                <Link to="/support" style={{ color: '#e50914', fontWeight: 600, marginTop: '1rem', display: 'inline-block', textDecoration: 'none' }}>
                  Create a ticket →
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {tickets.map(t => (
                  <div key={t.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{t.subject}</div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                        {t.category} · {new Date(t.createdAt).toLocaleDateString()}
                        {t.priority && <span style={{ color: t.priority === 'URGENT' || t.priority === 'HIGH' ? '#ef4444' : 'rgba(255,255,255,0.4)', marginLeft: 8 }}>· {t.priority}</span>}
                      </div>
                      {t.agentNote && (
                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.375rem', fontStyle: 'italic' }}>
                          Agent: {t.agentNote}
                        </div>
                      )}
                    </div>
                    <span style={{
                      fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: 99, flexShrink: 0,
                      background: `${ticketStatusColor[t.status] || '#64748b'}20`,
                      color: ticketStatusColor[t.status] || '#64748b',
                      border: `1px solid ${ticketStatusColor[t.status] || '#64748b'}40`,
                    }}>
                      {t.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
