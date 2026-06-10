import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Users, TrendingUp, AlertCircle, Activity, Clock, UserCheck, TicketCheck, TrendingDown, DollarSign } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import api from '../api/client';
import useAuthStore from '../store/authStore';

const fadeIn = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.08 } } };

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6366f1'];

function StatCard({ icon: Icon, label, value, change, color, delay = 0, sub }) {
  return (
    <motion.div variants={fadeIn} transition={{ delay }} className="stat-card">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: `${color}20`, border: `1px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: color,
        }}>
          <Icon size={22} />
        </div>
        {change !== undefined && (
          <span style={{
            fontSize: '0.75rem', fontWeight: 700,
            color: change >= 0 ? '#10b981' : '#ef4444',
            background: change >= 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
            padding: '0.2rem 0.5rem', borderRadius: 6
          }}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={{ fontSize: '2rem' }}>{value}</div>
      {sub && <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '0.25rem' }}>{sub}</div>}
    </motion.div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: '#1e2a45', border: '1px solid rgba(99,102,241,0.2)',
        borderRadius: 10, padding: '0.75rem 1rem', fontSize: '0.8rem'
      }}>
        <p style={{ color: '#94a3b8', marginBottom: 4 }}>{label}</p>
        {payload.map(p => (
          <p key={p.name} style={{ color: p.color, fontWeight: 600 }}>
            {p.name}: {p.name === 'MRR' ? `$${p.value.toLocaleString()}` : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { user } = useAuthStore();

  const { data: stats, isLoading } = useQuery({
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

  const pieData = stats ? [
    { name: 'Active', value: Number(stats.activeCustomers) },
    { name: 'Trial', value: Number(stats.trialCustomers) },
    { name: 'Churned', value: Number(stats.churnedCustomers) },
    { name: 'Other', value: Math.max(0, Number(stats.totalCustomers) - Number(stats.activeCustomers) - Number(stats.trialCustomers) - Number(stats.churnedCustomers)) },
  ] : [];

  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening';

  const mrrDisplay = stats?.mrr ? `$${Number(stats.mrr).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` : '—';

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">
      <motion.div variants={fadeIn} style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">{greeting}, {user?.fullName?.split(' ')[0] || user?.username} 👋</h1>
        <p className="page-subtitle">Here's what's happening with your platform today.</p>
      </motion.div>

      <motion.div variants={stagger} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <StatCard icon={Users} label="Total Customers" value={isLoading ? '—' : stats?.totalCustomers ?? 0} color="#6366f1" delay={0} />
        <StatCard icon={UserCheck} label="Active Subscribers" value={isLoading ? '—' : stats?.activeCustomers ?? 0} color="#10b981" delay={0.05} sub={isLoading ? '' : `${stats?.newThisMonth ?? 0} new this month`} />
        <StatCard icon={Clock} label="Trial Users" value={isLoading ? '—' : stats?.trialCustomers ?? 0} color="#f59e0b" delay={0.1} />
        <StatCard icon={TrendingDown} label="Churn Rate" value={isLoading ? '—' : `${stats?.churnRate ?? 0}%`} color="#ef4444" delay={0.15} />
        <StatCard icon={AlertCircle} label="Pending Requests" value={isLoading ? '—' : stats?.pendingRequests ?? 0} color="#3b82f6" delay={0.2} />
        <StatCard icon={TicketCheck} label="Open Tickets" value={isLoading ? '—' : stats?.openTickets ?? 0} color="#8b5cf6" delay={0.25} />
        <StatCard icon={DollarSign} label="Monthly Revenue" value={isLoading ? '—' : mrrDisplay} color="#10b981" delay={0.3} sub="From active subscribers" />
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 320px', gap: '1.25rem', marginBottom: '1.25rem' }}>
        <motion.div variants={fadeIn} className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9' }}>Subscriber Growth</h2>
            <span style={{ fontSize: '0.7rem', color: '#475569', background: 'rgba(99,102,241,0.1)', padding: '0.2rem 0.6rem', borderRadius: 99 }}>Live · 30s</span>
          </div>
          {growthData.length === 0 ? (
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="skeleton" style={{ width: '100%', height: '100%', borderRadius: 10 }} />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="gradCustomers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.08)" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="customers" name="Total" stroke="#6366f1" strokeWidth={2} fill="url(#gradCustomers)" />
                <Area type="monotone" dataKey="active" name="Active" stroke="#10b981" strokeWidth={2} fill="url(#gradActive)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        <motion.div variants={fadeIn} className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9' }}>Monthly Revenue (MRR)</h2>
            <span style={{ fontSize: '0.7rem', color: '#475569', background: 'rgba(99,102,241,0.1)', padding: '0.2rem 0.6rem', borderRadius: 99 }}>Live · 30s</span>
          </div>
          {mrrData.length === 0 ? (
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="skeleton" style={{ width: '100%', height: '100%', borderRadius: 10 }} />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={mrrData}>
                <defs>
                  <linearGradient id="gradBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.08)" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="mrr" name="MRR" fill="url(#gradBar)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        <motion.div variants={fadeIn} className="card">
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#f1f5f9' }}>Status Breakdown</h2>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
            {[['Active', '#10b981', stats?.activeCustomers], ['Trial', '#f59e0b', stats?.trialCustomers], ['Churned', '#ef4444', stats?.churnedCustomers]].map(([label, color, count]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                <span style={{ color: '#94a3b8', flex: 1 }}>{label}</span>
                <span style={{ color, fontWeight: 700 }}>{isLoading ? '—' : count ?? 0}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div variants={fadeIn} className="card">
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: '#f1f5f9' }}>Recent Customers</h2>
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 52, borderRadius: 10 }} />
            ))}
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Company</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Pipeline</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {(stats?.recentCustomers || []).map((c) => (
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
                    <td style={{ color: '#6366f1', fontSize: '0.8rem', fontWeight: 600 }}>{c.plan?.name || '—'}</td>
                    <td>
                      <span className={`badge badge-${c.subscriptionStatus?.toLowerCase()}`}>
                        {c.subscriptionStatus}
                      </span>
                    </td>
                    <td style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{c.pipelineStage}</td>
                    <td style={{ color: '#64748b', fontSize: '0.8rem' }}>
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
