import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trash2, Users } from 'lucide-react';
import api from '../api/client';

const AllCustomers = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['allCustomers'],
    queryFn: () => api.get('/api/customers', { params: { size: 100 } }).then(r => r.data),
    refetchInterval: 20000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/customers/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['allCustomers']),
  });

  const customers = data?.content || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ padding: '2rem 1.5rem' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <Users size={24} color="#6366f1" />
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#f1f5f9' }}>
          All Customers <span style={{ fontSize: '1rem', fontWeight: 500, color: '#64748b' }}>({customers.length})</span>
        </h1>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 64, borderRadius: 12 }} />
          ))}
        </div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrapper" style={{ border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Company</th>
                  <th>Status</th>
                  <th>Plan</th>
                  <th>Country</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(c => (
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
                    <td>
                      <span className={`badge badge-${c.subscriptionStatus?.toLowerCase() === 'active' ? 'active' : c.subscriptionStatus?.toLowerCase() === 'trial' ? 'trial' : 'churned'}`}>
                        {c.subscriptionStatus}
                      </span>
                    </td>
                    <td style={{ color: '#6366f1', fontSize: '0.8rem', fontWeight: 600 }}>{c.plan?.name || '—'}</td>
                    <td style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{c.country || '—'}</td>
                    <td style={{ color: '#64748b', fontSize: '0.8rem' }}>
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td>
                      <button
                        onClick={() => { if (window.confirm(`Delete ${c.name}?`)) deleteMutation.mutate(c.id); }}
                        className="btn btn-danger btn-sm btn-icon"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                {customers.length === 0 && (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#475569' }}>No customers found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AllCustomers;
