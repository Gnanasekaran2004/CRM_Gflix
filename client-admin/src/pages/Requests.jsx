import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle, XCircle, Clock, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../api/client';

const fadeIn = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

function RequestCard({ request, onApprove, onReject }) {
  const [expanded, setExpanded] = useState(false);
  const [note, setNote] = useState('');
  const statusColors = { PENDING: '#f59e0b', APPROVED: '#10b981', REJECTED: '#ef4444' };
  const statusBg = { PENDING: 'rgba(245,158,11,0.1)', APPROVED: 'rgba(16,185,129,0.1)', REJECTED: 'rgba(239,68,68,0.1)' };

  return (
    <motion.div
      variants={fadeIn}
      layout
      style={{
        background: '#1e2a45', border: '1px solid rgba(99,102,241,0.15)',
        borderRadius: 16, overflow: 'hidden',
        transition: 'border-color 0.2s'
      }}
    >
      <div style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.1rem', fontWeight: 700, color: 'white'
        }}>
          {request.name?.charAt(0).toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.95rem' }}>{request.name}</div>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{request.email}</div>
          {request.company && <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 2 }}>{request.company}</div>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {request.requestedPlan && (
            <span style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', padding: '0.25rem 0.75rem', borderRadius: 99, fontSize: '0.75rem', fontWeight: 700, border: '1px solid rgba(99,102,241,0.25)' }}>
              {request.requestedPlan.name}
            </span>
          )}
          <span style={{
            background: statusBg[request.status], color: statusColors[request.status],
            padding: '0.25rem 0.75rem', borderRadius: 99, fontSize: '0.75rem', fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: '0.35rem'
          }}>
            {request.status === 'PENDING' && <Clock size={12} />}
            {request.status === 'APPROVED' && <CheckCircle size={12} />}
            {request.status === 'REJECTED' && <XCircle size={12} />}
            {request.status}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#475569' }}>
            {new Date(request.createdAt).toLocaleDateString()}
          </span>
          <button
            onClick={() => setExpanded(p => !p)}
            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex' }}
          >
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid rgba(99,102,241,0.1)', paddingTop: '1.25rem' }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
            <div><span style={{ color: '#64748b' }}>Phone: </span><span style={{ color: '#94a3b8' }}>{request.phone || '—'}</span></div>
            {request.adminNote && <div><span style={{ color: '#64748b' }}>Note: </span><span style={{ color: '#94a3b8' }}>{request.adminNote}</span></div>}
          </div>

          {request.status === 'PENDING' && (
            <div>
              <div className="form-group">
                <label className="form-label">Admin Note (optional)</label>
                <input type="text" className="form-input" placeholder="Add a note..." value={note} onChange={e => setNote(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={() => onApprove(request.id, note)} className="btn btn-success" style={{ flex: 1, justifyContent: 'center' }}>
                  <CheckCircle size={16} /> Approve & Create Account
                </button>
                <button onClick={() => onReject(request.id, note)} className="btn btn-danger" style={{ flex: 1, justifyContent: 'center' }}>
                  <XCircle size={16} /> Reject
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

export default function Requests() {
  const [filter, setFilter] = useState('ALL');
  const queryClient = useQueryClient();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['requests'],
    queryFn: () => api.get('/api/requests').then(r => r.data),
    refetchInterval: 10000,
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, note }) => api.put(`/api/requests/${id}/approve`, { note }),
    onSuccess: () => { queryClient.invalidateQueries(['requests']); queryClient.invalidateQueries(['requestStats']); queryClient.invalidateQueries(['customers']); },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, note }) => api.put(`/api/requests/${id}/reject`, { note }),
    onSuccess: () => { queryClient.invalidateQueries(['requests']); queryClient.invalidateQueries(['requestStats']); },
  });

  const filtered = filter === 'ALL' ? requests : requests.filter(r => r.status === filter);
  const counts = { ALL: requests.length, PENDING: requests.filter(r => r.status === 'PENDING').length, APPROVED: requests.filter(r => r.status === 'APPROVED').length, REJECTED: requests.filter(r => r.status === 'REJECTED').length };

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.07 } } }}>
      <motion.div variants={fadeIn} className="page-header">
        <div>
          <h1 className="page-title">Access Requests</h1>
          <p className="page-subtitle">Review and manage subscription access requests</p>
        </div>
        {counts.PENDING > 0 && (
          <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 12, padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={18} color="#f59e0b" />
            <span style={{ color: '#fbbf24', fontWeight: 700 }}>{counts.PENDING} pending review</span>
          </div>
        )}
      </motion.div>

      {/* Filter Tabs */}
      <motion.div variants={fadeIn} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{
              padding: '0.5rem 1.25rem', borderRadius: 10, border: 'none', cursor: 'pointer',
              fontWeight: 600, fontSize: '0.875rem', transition: 'all 0.2s',
              background: filter === f ? 'rgba(99,102,241,0.2)' : 'rgba(30,42,69,0.6)',
              color: filter === f ? '#818cf8' : '#64748b',
              borderWidth: 1, borderStyle: 'solid',
              borderColor: filter === f ? 'rgba(99,102,241,0.4)' : 'transparent'
            }}>
            {f} <span style={{ opacity: 0.7 }}>({counts[f]})</span>
          </button>
        ))}
      </motion.div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 80, borderRadius: 16 }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <motion.div variants={fadeIn} style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
          <CheckCircle size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
          <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>No {filter.toLowerCase()} requests</p>
        </motion.div>
      ) : (
        <motion.div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          variants={{ show: { transition: { staggerChildren: 0.07 } } }}>
          {filtered.map(req => (
            <RequestCard
              key={req.id}
              request={req}
              onApprove={(id, note) => approveMutation.mutate({ id, note })}
              onReject={(id, note) => rejectMutation.mutate({ id, note })}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}