import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Check, Monitor, Download, Globe, X, ToggleLeft, ToggleRight } from 'lucide-react';
import api from '../api/client';

const fadeIn = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };
const PLAN_COLORS = { Basic: '#10b981', Standard: '#6366f1', Premium: '#f59e0b' };

function PlanCard({ plan, onDelete, onToggleActive }) {
  const color = PLAN_COLORS[plan.name] || '#6366f1';
  return (
    <motion.div variants={fadeIn} style={{
      background: '#1e2a45', border: `1px solid ${plan.active ? color + '30' : 'rgba(100,116,139,0.2)'}`,
      borderRadius: 20, padding: '1.75rem', position: 'relative', overflow: 'hidden',
      opacity: plan.active ? 1 : 0.65,
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${plan.active ? color : '#475569'}, transparent)` }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: plan.active ? color : '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{plan.name}</div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button onClick={() => onToggleActive(plan)} title={plan.active ? 'Deactivate' : 'Activate'}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: plan.active ? '#10b981' : '#64748b', display: 'flex', alignItems: 'center' }}>
            {plan.active ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
          </button>
          <button onClick={() => onDelete(plan.id)} style={{ background: 'none', border: 'none', color: '#374151', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>
      </div>
      <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#f1f5f9', lineHeight: 1 }}>
        ${plan.monthlyPrice}<span style={{ fontSize: '1rem', color: '#64748b', fontWeight: 500 }}>/mo</span>
      </div>
      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem', marginBottom: '1.25rem' }}>
        ${plan.annualPrice}/year · Save {Math.round((1 - plan.annualPrice / (plan.monthlyPrice * 12)) * 100)}%
      </div>
      <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '1.25rem', lineHeight: 1.6 }}>{plan.description}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        {[
          [Monitor, `${plan.maxScreens} screen${plan.maxScreens > 1 ? 's' : ''} simultaneously`],
          [Globe, `${plan.videoQuality} quality`],
          [Download, `Downloads ${plan.downloadAllowed ? 'included' : 'not included'}`],
        ].map(([Icon, text]) => (
          <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.8rem', color: '#94a3b8' }}>
            <Icon size={14} color={plan.active ? color : '#64748b'} />
            {text}
          </div>
        ))}
      </div>
      {!plan.active && (
        <div style={{ position: 'absolute', bottom: '1rem', left: '1.75rem', fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
          Inactive
        </div>
      )}
    </motion.div>
  );
}

export default function Plans() {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', monthlyPrice: '', annualPrice: '', maxScreens: 1, videoQuality: 'HD', downloadAllowed: false, offlineViewing: false });
  const queryClient = useQueryClient();

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ['plans'],
    queryFn: () => api.get('/api/plans').then(r => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (data) => api.post('/api/plans', data),
    onSuccess: () => { queryClient.invalidateQueries(['plans']); setShowAdd(false); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/plans/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['plans']),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: (plan) => api.put(`/api/plans/${plan.id}`, { ...plan, active: !plan.active }),
    onSuccess: () => queryClient.invalidateQueries(['plans']),
  });

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.07 } } }}>
      <motion.div variants={fadeIn} className="page-header">
        <div>
          <h1 className="page-title">Subscription Plans</h1>
          <p className="page-subtitle">Manage your streaming subscription tiers · {plans.filter(p => p.active).length} active</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(p => !p)}>
          <Plus size={18} /> {showAdd ? 'Cancel' : 'New Plan'}
        </button>
      </motion.div>

      {showAdd && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: '#f1f5f9' }}>Create New Plan</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {[['name', 'Plan Name'], ['description', 'Description'], ['monthlyPrice', 'Monthly Price ($)'], ['annualPrice', 'Annual Price ($)']].map(([key, label]) => (
              <div key={key} className="form-group">
                <label className="form-label">{label}</label>
                <input type={key.includes('Price') ? 'number' : 'text'} className="form-input" value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
              </div>
            ))}
            <div className="form-group">
              <label className="form-label">Max Screens</label>
              <select className="form-input form-select" value={form.maxScreens} onChange={e => setForm(p => ({ ...p, maxScreens: Number(e.target.value) }))}>
                {[1, 2, 4].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Video Quality</label>
              <select className="form-input form-select" value={form.videoQuality} onChange={e => setForm(p => ({ ...p, videoQuality: e.target.value }))}>
                {['HD', 'Full HD', '4K', '4K + HDR'].map(q => <option key={q}>{q}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem' }}>
            {[['downloadAllowed', 'Downloads Allowed'], ['offlineViewing', 'Offline Viewing']].map(([key, label]) => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: '#94a3b8' }}>
                <input type="checkbox" checked={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.checked }))} />
                {label}
              </label>
            ))}
          </div>
          <button onClick={() => createMutation.mutate({ ...form, monthlyPrice: Number(form.monthlyPrice), annualPrice: Number(form.annualPrice) })}
            className="btn btn-primary" style={{ marginTop: '1rem' }}>
            <Check size={16} /> Create Plan
          </button>
        </motion.div>
      )}

      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 300, borderRadius: 20 }} />)}
        </div>
      ) : (
        <motion.div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}>
          {plans.map(plan => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onDelete={(id) => { if (window.confirm('Delete this plan?')) deleteMutation.mutate(id); }}
              onToggleActive={(plan) => toggleActiveMutation.mutate(plan)}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
