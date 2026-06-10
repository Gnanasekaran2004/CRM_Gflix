import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ticket, Clock, CheckCircle, AlertCircle, MessageSquare, X } from 'lucide-react';
import api from '../api/client';

const fadeIn = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const priorityColors = { LOW: '#10b981', MEDIUM: '#f59e0b', HIGH: '#ef4444', URGENT: '#ec4899' };
const statusColors = { OPEN: '#3b82f6', IN_PROGRESS: '#f59e0b', RESOLVED: '#10b981', CLOSED: '#64748b' };

function TicketDetailModal({ ticket, onClose, onUpdate }) {
  const [status, setStatus] = useState(ticket.status);
  const [agentNote, setAgentNote] = useState(ticket.agentNote || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await onUpdate(ticket.id, status, agentNote);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        style={{ background: '#111827', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 20, padding: '2rem', width: '100%', maxWidth: 560 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Ticket #{ticket.id}</div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f1f5f9' }}>{ticket.subject}</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
          <div style={{ background: 'rgba(30,42,69,0.6)', borderRadius: 10, padding: '0.75rem' }}>
            <div style={{ color: '#64748b', fontSize: '0.7rem', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Customer</div>
            <div style={{ fontWeight: 600, color: '#f1f5f9' }}>{ticket.customer?.name}</div>
            <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{ticket.customer?.email}</div>
          </div>
          <div style={{ background: 'rgba(30,42,69,0.6)', borderRadius: 10, padding: '0.75rem' }}>
            <div style={{ color: '#64748b', fontSize: '0.7rem', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Details</div>
            <div style={{ color: priorityColors[ticket.priority], fontWeight: 700, fontSize: '0.8rem' }}>● {ticket.priority}</div>
            <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{ticket.category}</div>
          </div>
        </div>

        <div style={{ background: 'rgba(30,42,69,0.4)', borderRadius: 10, padding: '1rem', marginBottom: '1.25rem', fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6 }}>
          {ticket.description}
        </div>

        <div className="form-group">
          <label className="form-label">Update Status</label>
          <select className="form-input form-select" value={status} onChange={e => setStatus(e.target.value)}>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Agent Note</label>
          <textarea
            className="form-input"
            rows={3}
            placeholder="Add an internal note or resolution details..."
            value={agentNote}
            onChange={e => setAgentNote(e.target.value)}
            style={{ resize: 'vertical' }}
          />
        </div>

        {ticket.agentNote && (
          <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 8, padding: '0.75rem', marginBottom: '1rem', fontSize: '0.8rem', color: '#94a3b8' }}>
            <span style={{ color: '#6366f1', fontWeight: 700 }}>Previous note: </span>{ticket.agentNote}
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button onClick={onClose} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
          <button onClick={handleSave} disabled={loading} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function SupportTickets() {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const queryClient = useQueryClient();

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['tickets'],
    queryFn: () => api.get('/api/tickets').then(r => r.data),
    refetchInterval: 15000,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status, agentNote }) => api.put(`/api/tickets/${id}/status`, { status, agentNote }),
    onSuccess: () => queryClient.invalidateQueries(['tickets']),
  });

  const handleUpdate = async (id, status, agentNote) => {
    await updateMutation.mutateAsync({ id, status, agentNote });
  };

  const filtered = tickets.filter(t => {
    const statusMatch = statusFilter === 'ALL' || t.status === statusFilter;
    const priorityMatch = priorityFilter === 'ALL' || t.priority === priorityFilter;
    return statusMatch && priorityMatch;
  });

  const counts = {
    ALL: tickets.length,
    OPEN: tickets.filter(t => t.status === 'OPEN').length,
    IN_PROGRESS: tickets.filter(t => t.status === 'IN_PROGRESS').length,
    RESOLVED: tickets.filter(t => t.status === 'RESOLVED').length,
    CLOSED: tickets.filter(t => t.status === 'CLOSED').length,
  };

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.07 } } }}>
      {selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onUpdate={handleUpdate}
        />
      )}

      <motion.div variants={fadeIn} className="page-header">
        <div>
          <h1 className="page-title">Support Tickets</h1>
          <p className="page-subtitle">Manage customer support requests — live updates every 15s</p>
        </div>
        <span style={{ fontSize: '0.75rem', color: '#475569', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', padding: '0.4rem 1rem', borderRadius: 99 }}>
          🟢 Live · 15s
        </span>
      </motion.div>

      <motion.div variants={fadeIn} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total', value: tickets.length, color: '#6366f1', icon: Ticket },
          { label: 'Open', value: counts.OPEN, color: '#3b82f6', icon: AlertCircle },
          { label: 'In Progress', value: counts.IN_PROGRESS, color: '#f59e0b', icon: Clock },
          { label: 'Resolved', value: counts.RESOLVED, color: '#10b981', icon: CheckCircle },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="stat-card" style={{ padding: '1rem 1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
              <Icon size={18} color={color} />
              <span className="stat-label" style={{ margin: 0 }}>{label}</span>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color }}>{value}</div>
          </div>
        ))}
      </motion.div>

      <motion.div variants={fadeIn} style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map(f => (
            <button key={f} onClick={() => setStatusFilter(f)}
              style={{
                padding: '0.5rem 1rem', borderRadius: 10, border: `1px solid ${statusFilter === f ? 'rgba(99,102,241,0.4)' : 'transparent'}`,
                cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem',
                background: statusFilter === f ? 'rgba(99,102,241,0.2)' : 'rgba(30,42,69,0.6)',
                color: statusFilter === f ? '#818cf8' : '#64748b',
              }}>
              {f.replace('_', ' ')} ({counts[f] ?? tickets.length})
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto' }}>
          {['ALL', 'URGENT', 'HIGH', 'MEDIUM', 'LOW'].map(p => (
            <button key={p} onClick={() => setPriorityFilter(p)}
              style={{
                padding: '0.4rem 0.75rem', borderRadius: 8, border: `1px solid ${priorityFilter === p ? (priorityColors[p] || 'rgba(99,102,241,0.4)') + '60' : 'transparent'}`,
                cursor: 'pointer', fontWeight: 600, fontSize: '0.75rem',
                background: priorityFilter === p ? `${priorityColors[p] || '#6366f1'}15` : 'transparent',
                color: priorityFilter === p ? (priorityColors[p] || '#818cf8') : '#64748b',
              }}>
              {p}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeIn} className="card" style={{ padding: 0 }}>
        {isLoading ? (
          <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[...Array(5)].map((_, i) => <div key={i} className="skeleton" style={{ height: 64, borderRadius: 8 }} />)}
          </div>
        ) : (
          <div className="table-wrapper" style={{ border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>#ID</th>
                  <th>Customer</th>
                  <th>Subject</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id}>
                    <td style={{ color: '#64748b', fontSize: '0.8rem' }}>#{t.id}</td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{t.customer?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{t.customer?.email}</div>
                    </td>
                    <td style={{ maxWidth: 200 }}>
                      <div style={{ fontWeight: 500, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.subject}</div>
                      {t.agentNote && (
                        <div style={{ fontSize: '0.7rem', color: '#6366f1', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <MessageSquare size={10} />Note added
                        </div>
                      )}
                    </td>
                    <td>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', background: 'rgba(30,42,69,0.8)', padding: '0.2rem 0.6rem', borderRadius: 6 }}>
                        {t.category}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: priorityColors[t.priority] }}>
                        ● {t.priority}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: statusColors[t.status], background: `${statusColors[t.status]}15`, padding: '0.25rem 0.6rem', borderRadius: 6 }}>
                        {t.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ color: '#64748b', fontSize: '0.8rem' }}>
                      {new Date(t.createdAt).toLocaleDateString()}
                      {t.resolvedAt && <div style={{ fontSize: '0.7rem', color: '#10b981' }}>✓ {new Date(t.resolvedAt).toLocaleDateString()}</div>}
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedTicket(t)}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem' }}
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: '#475569' }}>No tickets found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
