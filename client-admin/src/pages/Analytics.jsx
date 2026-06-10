import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import api from '../api/client';

const fadeIn = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: '#1e2a45', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 10, padding: '0.75rem 1rem', fontSize: '0.8rem' }}>
        <p style={{ color: '#94a3b8', marginBottom: 4 }}>{label}</p>
        {payload.map(p => (
          <p key={p.name} style={{ color: p.color, fontWeight: 600 }}>
            {p.name}: {typeof p.value === 'number' && p.name.toLowerCase().includes('mrr') ? `$${p.value.toLocaleString()}` : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const { data: stats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => api.get('/api/dashboard/stats').then(r => r.data),
    refetchInterval: 15000,
  });

  const { data: growthData = [] } = useQuery({
    queryKey: ['dashboardGrowth'],
    queryFn: () => api.get('/api/dashboard/growth').then(r => r.data),
    refetchInterval: 30000,
  });

  const { data: mrrData = [] } = useQuery({
    queryKey: ['dashboardMrr'],
    queryFn: () => api.get('/api/dashboard/mrr').then(r => r.data),
    refetchInterval: 30000,
  });

  const { data: planData = [] } = useQuery({
    queryKey: ['dashboardPlans'],
    queryFn: () => api.get('/api/dashboard/plans').then(r => r.data),
    refetchInterval: 30000,
  });

  const { data: countryData = [] } = useQuery({
    queryKey: ['dashboardCountries'],
    queryFn: () => api.get('/api/dashboard/countries').then(r => r.data),
    refetchInterval: 30000,
  });

  const currentMrr = stats?.mrr ?? 0;
  const annualRunRate = currentMrr * 12;
  const arpu = stats?.activeCustomers > 0 ? (currentMrr / stats.activeCustomers) : 0;
  const maxCountry = countryData.length > 0 ? Math.max(...countryData.map(d => d.customers)) : 1;

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
      <motion.div variants={fadeIn} className="page-header">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">Platform performance & subscriber insights — live from database</p>
        </div>
        <span style={{ fontSize: '0.75rem', color: '#475569', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', padding: '0.4rem 1rem', borderRadius: 99 }}>
          🟢 Live · Auto-refresh 15s
        </span>
      </motion.div>

      <motion.div variants={fadeIn} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Monthly Revenue (MRR)', value: `$${Math.round(currentMrr).toLocaleString()}`, sub: 'From active subscribers', color: '#6366f1' },
          { label: 'Annual Revenue Run Rate', value: `$${Math.round(annualRunRate).toLocaleString()}`, sub: 'MRR × 12', color: '#10b981' },
          { label: 'Avg Revenue Per User', value: `$${arpu.toFixed(2)}`, sub: 'ARPU (active)', color: '#f59e0b' },
          { label: 'Churn Rate', value: `${stats?.churnRate ?? 0}%`, sub: 'Churned / Total', color: '#ef4444' },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="stat-card">
            <div className="stat-label">{label}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color, lineHeight: 1.2, margin: '0.5rem 0' }}>{value}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{sub}</div>
          </div>
        ))}
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
        <motion.div variants={fadeIn} className="card">
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: '#f1f5f9' }}>New vs Churned Customers</h2>
          {growthData.length === 0 ? (
            <div className="skeleton" style={{ height: 220, borderRadius: 10 }} />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={growthData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.08)" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '0.8rem', color: '#94a3b8' }} />
                <Bar dataKey="newCustomers" name="New" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="churned" name="Churned (cum)" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        <motion.div variants={fadeIn} className="card">
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: '#f1f5f9' }}>Plan Distribution</h2>
          {planData.length === 0 ? (
            <div className="skeleton" style={{ height: 180, borderRadius: 10 }} />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={planData} cx="50%" cy="50%" outerRadius={70} dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={{ stroke: '#374151' }}>
                    {planData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', marginTop: '0.75rem' }}>
                {planData.map((item, i) => (
                  <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[i], flexShrink: 0 }} />
                    <span style={{ color: '#94a3b8', flex: 1 }}>{item.name}</span>
                    <span style={{ color: COLORS[i], fontWeight: 700 }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        <motion.div variants={fadeIn} className="card">
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: '#f1f5f9' }}>MRR Trend (6 months)</h2>
          {mrrData.length === 0 ? (
            <div className="skeleton" style={{ height: 200, borderRadius: 10 }} />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={mrrData}>
                <defs>
                  <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.08)" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="mrr" name="MRR" stroke="#10b981" strokeWidth={2} fill="url(#mrrGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        <motion.div variants={fadeIn} className="card">
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: '#f1f5f9' }}>Customers by Country</h2>
          {countryData.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#475569', fontSize: '0.875rem' }}>No country data available</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {countryData.slice(0, 8).map(({ country, customers }) => {
                const pct = (customers / maxCountry) * 100;
                return (
                  <div key={country} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', width: 80, textAlign: 'right', flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{country}</span>
                    <div style={{ flex: 1, background: 'rgba(30,42,69,0.8)', borderRadius: 99, height: 8, overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', borderRadius: 99, transition: 'width 0.8s ease' }} />
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', width: 28, flexShrink: 0, textAlign: 'right' }}>{customers}</span>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
