import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Plus, Edit, Trash2, Eye, ChevronLeft, ChevronRight, X, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/client';

const fadeIn = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const STATUS_COLORS = { ACTIVE: 'active', TRIAL: 'trial', CHURNED: 'churned', PAUSED: 'pending', EXPIRED: 'rejected' };

function StatusBadge({ status }) {
  return <span className={`badge badge-${STATUS_COLORS[status] || 'pending'}`}>{status}</span>;
}

function AddCustomerModal({ onClose, onSuccess, plans }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', password: 'temp1234', planId: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      if (form.planId) payload.plan = { id: Number(form.planId) };
      delete payload.planId;
      await api.post('/api/customers', payload);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        style={{ background: '#111827', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 20, padding: '2rem', width: '100%', maxWidth: 520 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f1f5f9' }}>Add New Customer</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={20} /></button>
        </div>
        {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '0.75rem', marginBottom: '1rem', color: '#f87171', fontSize: '0.875rem' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {[['name', 'Full Name', 'text'], ['email', 'Email', 'email'], ['phone', 'Phone', 'text'], ['company', 'Company', 'text']].map(([field, label, type]) => (
              <div key={field} className="form-group" style={{ margin: 0 }}>
                <label className="form-label">{label}</label>
                <input type={type} className="form-input" value={form[field]} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))} required={field === 'name' || field === 'email'} />
              </div>
            ))}
          </div>
          <div className="form-group" style={{ marginTop: '0.75rem' }}>
            <label className="form-label">Subscription Plan</label>
            <select className="form-input form-select" value={form.planId} onChange={e => setForm(p => ({ ...p, planId: e.target.value }))}>
              <option value="">— No plan —</option>
              {(plans || []).map(p => <option key={p.id} value={p.id}>{p.name} (${p.monthlyPrice}/mo)</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
              {loading ? 'Adding...' : 'Add Customer'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function EditCustomerModal({ customer, onClose, onSuccess, plans }) {
  const [form, setForm] = useState({
    name: customer.name || '',
    email: customer.email || '',
    phone: customer.phone || '',
    company: customer.company || '',
    notes: customer.notes || '',
    country: customer.country || '',
    city: customer.city || '',
    planId: customer.plan?.id?.toString() || '',
    subscriptionStatus: customer.subscriptionStatus || 'TRIAL',
    pipelineStage: customer.pipelineStage || 'LEAD',
    billingCycle: customer.billingCycle || 'MONTHLY',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        company: form.company,
        notes: form.notes,
        country: form.country,
        city: form.city,
        subscriptionStatus: form.subscriptionStatus,
        pipelineStage: form.pipelineStage,
        billingCycle: form.billingCycle,
      };
      if (form.planId) payload.plan = { id: Number(form.planId) };
      await api.put(`/api/customers/${customer.id}`, payload);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', overflowY: 'auto' }}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        style={{ background: '#111827', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 20, padding: '2rem', width: '100%', maxWidth: 600, margin: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f1f5f9' }}>Edit Customer</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={20} /></button>
        </div>
        {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '0.75rem', marginBottom: '1rem', color: '#f87171', fontSize: '0.875rem' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {[['name', 'Full Name'], ['email', 'Email'], ['phone', 'Phone'], ['company', 'Company'], ['country', 'Country'], ['city', 'City']].map(([field, label]) => (
              <div key={field} className="form-group" style={{ margin: 0 }}>
                <label className="form-label">{label}</label>
                <input type="text" className="form-input" value={form[field]} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))} />
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Status</label>
              <select className="form-input form-select" value={form.subscriptionStatus} onChange={e => setForm(p => ({ ...p, subscriptionStatus: e.target.value }))}>
                {['TRIAL', 'ACTIVE', 'PAUSED', 'CHURNED', 'EXPIRED'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Pipeline Stage</label>
              <select className="form-input form-select" value={form.pipelineStage} onChange={e => setForm(p => ({ ...p, pipelineStage: e.target.value }))}>
                {['LEAD', 'TRIAL', 'ACTIVE', 'CHURNED'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Billing Cycle</label>
              <select className="form-input form-select" value={form.billingCycle} onChange={e => setForm(p => ({ ...p, billingCycle: e.target.value }))}>
                <option value="MONTHLY">Monthly</option>
                <option value="ANNUAL">Annual</option>
              </select>
            </div>
          </div>
          <div className="form-group" style={{ marginTop: '0.75rem' }}>
            <label className="form-label">Subscription Plan</label>
            <select className="form-input form-select" value={form.planId} onChange={e => setForm(p => ({ ...p, planId: e.target.value }))}>
              <option value="">— No plan —</option>
              {(plans || []).map(p => <option key={p.id} value={p.id}>{p.name} (${p.monthlyPrice}/mo)</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginTop: '0.75rem' }}>
            <label className="form-label">Notes</label>
            <textarea className="form-input" rows={2} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} style={{ resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
              <Save size={16} />{loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function Customers() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['customers', search, page, statusFilter],
    queryFn: () => api.get('/api/customers', { params: { search, page, size: 10, status: statusFilter } }).then(r => r.data),
    placeholderData: p => p,
    refetchInterval: 20000,
  });

  const { data: plans = [] } = useQuery({
    queryKey: ['plans'],
    queryFn: () => api.get('/api/plans').then(r => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/customers/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['customers']),
  });

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}? This cannot be undone.`)) {
      deleteMutation.mutate(id);
    }
  };

  const invalidate = () => {
    queryClient.invalidateQueries(['customers']);
    queryClient.invalidateQueries(['dashboardStats']);
  };

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.07 } } }}>
      {showAdd && <AddCustomerModal onClose={() => setShowAdd(false)} onSuccess={invalidate} plans={plans} />}
      {editCustomer && <EditCustomerModal customer={editCustomer} onClose={() => setEditCustomer(null)} onSuccess={invalidate} plans={plans} />}

      <motion.div variants={fadeIn} className="page-header">
        <div>
          <h1 className="page-title">Customers</h1>
          <p className="page-subtitle">{data?.totalElements ?? 0} total subscribers</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          <Plus size={18} /> Add Customer
        </button>
      </motion.div>

      <motion.div variants={fadeIn} className="card" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#4b5563' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search by name, email, company..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(0); }}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[['', 'All'], ['ACTIVE', 'Active'], ['TRIAL', 'Trial'], ['CHURNED', 'Churned']].map(([val, label]) => (
              <button key={val} onClick={() => { setStatusFilter(val); setPage(0); }}
                style={{
                  padding: '0.4rem 1rem', borderRadius: 8, border: `1px solid ${statusFilter === val ? 'rgba(99,102,241,0.4)' : 'rgba(99,102,241,0.1)'}`,
                  cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
                  background: statusFilter === val ? 'rgba(99,102,241,0.2)' : 'transparent',
                  color: statusFilter === val ? '#818cf8' : '#64748b',
                }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeIn} className="card" style={{ padding: 0 }}>
        {isLoading ? (
          <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[...Array(8)].map((_, i) => <div key={i} className="skeleton" style={{ height: 56, borderRadius: 8 }} />)}
          </div>
        ) : (
          <>
            <div className="table-wrapper" style={{ borderRadius: '16px 16px 0 0', border: 'none' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Company</th>
                    <th>Status</th>
                    <th>Plan</th>
                    <th>Stage</th>
                    <th>Country</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.content || []).map((c) => (
                    <tr key={c.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div className="avatar" style={{ width: 36, height: 36, fontSize: '0.8rem' }}>
                            {c.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{c.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{c.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{c.company || '—'}</td>
                      <td><StatusBadge status={c.subscriptionStatus} /></td>
                      <td style={{ color: '#6366f1', fontSize: '0.8rem', fontWeight: 600 }}>{c.plan?.name || '—'}</td>
                      <td style={{ fontSize: '0.8rem' }}>
                        <span style={{ color: '#6366f1', background: 'rgba(99,102,241,0.1)', padding: '0.2rem 0.6rem', borderRadius: 6, fontWeight: 600 }}>
                          {c.pipelineStage}
                        </span>
                      </td>
                      <td style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{c.country || '—'}</td>
                      <td style={{ color: '#64748b', fontSize: '0.8rem' }}>
                        {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.375rem' }}>
                          <button onClick={() => setEditCustomer(c)} className="btn btn-secondary btn-sm btn-icon" title="Edit">
                            <Edit size={14} />
                          </button>
                          <button onClick={() => handleDelete(c.id, c.name)} className="btn btn-danger btn-sm btn-icon" title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {data?.content?.length === 0 && (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: '#475569' }}>
                        No customers found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {data?.totalPages > 1 && (
              <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Page {page + 1} of {data.totalPages} ({data.totalElements} results)
                </span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="btn btn-secondary btn-sm btn-icon">
                    <ChevronLeft size={16} />
                  </button>
                  <button disabled={page >= data.totalPages - 1} onClick={() => setPage(p => p + 1)} className="btn btn-secondary btn-sm btn-icon">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
