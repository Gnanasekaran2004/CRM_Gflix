import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tv, ArrowLeft, HelpCircle, CheckCircle, Loader2, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import gflixApi from '../api/gflixClient';
import useCustomerAuthStore from '../store/customerAuthStore';

const CATEGORIES = ['BILLING', 'TECHNICAL', 'ACCOUNT', 'CONTENT', 'GENERAL'];
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

const statusColors = { OPEN: '#3b82f6', IN_PROGRESS: '#f59e0b', RESOLVED: '#10b981', CLOSED: '#64748b' };
const priorityColors = { LOW: '#10b981', MEDIUM: '#f59e0b', HIGH: '#ef4444', URGENT: '#ec4899' };

export default function Support() {
  const { customer } = useCustomerAuthStore();
  const queryClient = useQueryClient();
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState('new');
  const [form, setForm] = useState({ subject: '', description: '', category: 'GENERAL', priority: 'MEDIUM' });

  const { data: profile } = useQuery({
    queryKey: ['customerProfile'],
    queryFn: () => gflixApi.get('/api/customer-auth/me').then(r => r.data),
  });

  const { data: tickets = [] } = useQuery({
    queryKey: ['myTickets'],
    queryFn: () => gflixApi.get(`/api/tickets/customer/${profile?.id}`).then(r => r.data),
    enabled: !!profile?.id,
    refetchInterval: 30000,
  });

  const submitMutation = useMutation({
    mutationFn: () => gflixApi.post('/api/tickets', { ...form, customerId: profile?.id }),
    onSuccess: () => {
      setSubmitted(true);
      queryClient.invalidateQueries(['myTickets']);
      setForm({ subject: '', description: '', category: 'GENERAL', priority: 'MEDIUM' });
    },
  });

  return (
    <div style={{ background: '#141414', minHeight: '100vh' }}>
      <header style={{ padding: '1.25rem 3rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/browse" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <img src="/logo.png" alt="PulseStream Logo" style={{ height: '24px' }} />
          <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#e50914' }}>PulseStream</span>
        </Link>
        <Link to="/browse" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.875rem' }}>
          <ArrowLeft size={16} /> Back
        </Link>
      </header>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '3rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(229,9,20,0.15)', border: '1px solid rgba(229,9,20,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <HelpCircle size={26} color="#e50914" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 900 }}>Support Center</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem' }}>We typically respond within 24 hours</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
          {[['new', 'New Ticket'], ['history', `My Tickets (${tickets.length})`]].map(([tab, label]) => (
            <button key={tab} onClick={() => { setActiveTab(tab); setSubmitted(false); }}
              style={{
                padding: '0.625rem 1.25rem', borderRadius: 6, border: 'none', cursor: 'pointer',
                background: activeTab === tab ? 'rgba(229,9,20,0.2)' : 'rgba(255,255,255,0.05)',
                color: activeTab === tab ? '#fff' : 'rgba(255,255,255,0.5)',
                fontWeight: activeTab === tab ? 700 : 500, fontSize: '0.875rem', fontFamily: 'Inter, sans-serif',
              }}>
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'new' && (
          <>
            {submitted ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                style={{ textAlign: 'center', padding: '3rem' }}>
                <CheckCircle size={64} color="#10b981" style={{ marginBottom: '1.5rem' }} />
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>Ticket Submitted!</h2>
                <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2rem' }}>Our support team will get back to you soon.</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <button onClick={() => setSubmitted(false)} className="gflix-btn gflix-btn-ghost">Submit Another</button>
                  <button onClick={() => { setActiveTab('history'); setSubmitted(false); }} className="gflix-btn gflix-btn-red">View My Tickets</button>
                </div>
              </motion.div>
            ) : (
              <>
                {!profile?.id && (
                  <div style={{ background: 'rgba(229,9,20,0.1)', border: '1px solid rgba(229,9,20,0.3)', borderRadius: 8, padding: '1rem', marginBottom: '1.5rem', fontSize: '0.875rem', color: '#ff6b72' }}>
                    Please ensure you're logged in to submit a support ticket.
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Subject</label>
                    <input type="text" className="gflix-input" placeholder="Brief description of your issue" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Category</label>
                      <select className="gflix-input" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Priority</label>
                      <select className="gflix-input" value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}>
                        {PRIORITIES.map(p => <option key={p}>{p}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Description</label>
                    <textarea className="gflix-input" placeholder="Describe your issue in detail..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={5} style={{ resize: 'vertical' }} />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => submitMutation.mutate()}
                    disabled={submitMutation.isPending || !profile?.id || !form.subject || !form.description}
                    className="gflix-btn gflix-btn-red"
                    style={{ width: '100%', fontSize: '1rem', marginTop: '0.5rem', opacity: (!profile?.id || !form.subject || !form.description) ? 0.5 : 1 }}
                  >
                    {submitMutation.isPending ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : null}
                    {submitMutation.isPending ? 'Submitting...' : 'Submit Support Ticket'}
                  </motion.button>
                </div>
              </>
            )}
          </>
        )}

        {activeTab === 'history' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {tickets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.3)' }}>
                <HelpCircle size={48} style={{ marginBottom: '1rem' }} />
                <p>No tickets yet. Create your first ticket above.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {tickets.map(t => (
                  <div key={t.id} style={{
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 12, padding: '1.25rem', transition: 'border-color 0.2s'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem' }}>{t.subject}</div>
                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>
                          #{t.id} · {t.category}
                          <span style={{ color: priorityColors[t.priority], marginLeft: 8 }}>· {t.priority}</span>
                        </div>
                      </div>
                      <span style={{
                        fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: 99, flexShrink: 0,
                        background: `${statusColors[t.status] || '#64748b'}20`,
                        color: statusColors[t.status] || '#64748b',
                      }}>
                        {t.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={12} /> Submitted {new Date(t.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      {t.resolvedAt && <span style={{ color: '#10b981' }}>· Resolved {new Date(t.resolvedAt).toLocaleDateString()}</span>}
                    </div>
                    {t.agentNote && (
                      <div style={{ marginTop: '0.75rem', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 8, padding: '0.75rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
                        <span style={{ color: '#818cf8', fontWeight: 700 }}>Agent response: </span>{t.agentNote}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
