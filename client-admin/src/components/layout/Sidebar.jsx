import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, Bell, FileText, BarChart2, Settings, CreditCard, HelpCircle, ChevronLeft, ChevronRight, LogOut, Shield } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/' },
  { icon: Users, label: 'Customers', to: '/customers' },
  { icon: Bell, label: 'Requests', to: '/requests', badge: 'pending' },
  { icon: BarChart2, label: 'Analytics', to: '/analytics' },
  { icon: HelpCircle, label: 'Support', to: '/tickets' },
  { icon: CreditCard, label: 'Plans', to: '/plans' },
  { icon: Settings, label: 'Settings', to: '/settings' },
];

const roleColors = {
  SUPER_ADMIN: '#6366f1',
  CRM_AGENT: '#10b981',
  SUPPORT_REP: '#f59e0b',
};

export default function Sidebar({ collapsed, onToggle, pendingCount = 0 }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        background: 'rgba(17, 24, 39, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(99, 102, 241, 0.15)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <div style={{ padding: '1.5rem 1rem', borderBottom: '1px solid rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', gap: '0.75rem', minHeight: '72px' }}>
        <div style={{
          width: 40, height: 40, borderRadius: '12px', flexShrink: 0,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(99,102,241,0.4)'
        }}>
          <Shield size={20} color="white" />
        </div>
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f1f5f9', lineHeight: 1 }}>PulseStream</div>
            <div style={{ fontSize: '0.7rem', color: '#6366f1', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Admin Panel</div>
          </motion.div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '1rem 0.625rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {navItems.map(({ icon: Icon, label, to, badge }) => (
          <NavLink key={to} to={to} end={to === '/'} style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <motion.div
                whileHover={{ x: 2 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.875rem',
                  padding: '0.75rem',
                  borderRadius: '12px',
                  background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(99,102,241,0.35)' : 'transparent'}`,
                  color: isActive ? '#818cf8' : '#94a3b8',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  cursor: 'pointer',
                  overflow: 'hidden',
                }}
              >
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <Icon size={20} />
                  {badge === 'pending' && pendingCount > 0 && (
                    <span style={{
                      position: 'absolute', top: -6, right: -6,
                      background: '#ef4444', color: 'white',
                      fontSize: '0.6rem', fontWeight: 800,
                      borderRadius: '99px', minWidth: 16, height: 16,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      padding: '0 4px'
                    }}>{pendingCount}</span>
                  )}
                </div>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ fontSize: '0.9rem', fontWeight: isActive ? 600 : 500, whiteSpace: 'nowrap' }}
                  >
                    {label}
                  </motion.span>
                )}
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Profile */}
      {user && (
        <div style={{ padding: '1rem 0.625rem', borderTop: '1px solid rgba(99, 102, 241, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '12px', background: 'rgba(30, 42, 69, 0.5)', marginBottom: '0.5rem' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              background: `linear-gradient(135deg, ${roleColors[user.role] || '#6366f1'}, #8b5cf6)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.875rem', fontWeight: 700, color: 'white'
            }}>
              {(user.fullName || user.username || 'A').charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.fullName || user.username}
                </div>
                <div style={{ fontSize: '0.7rem', color: roleColors[user.role] || '#6366f1', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {user.role?.replace('_', ' ')}
                </div>
              </motion.div>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '0.875rem',
              padding: '0.75rem', borderRadius: '12px', border: 'none', cursor: 'pointer',
              background: 'rgba(239, 68, 68, 0.1)', color: '#f87171',
              fontSize: '0.875rem', fontWeight: 600, transition: 'all 0.2s',
            }}
          >
            <LogOut size={18} />
            {!collapsed && <span>Sign Out</span>}
          </motion.button>
        </div>
      )}

      {/* Collapse Toggle */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        onClick={onToggle}
        style={{
          position: 'absolute', top: '50%', right: -12,
          transform: 'translateY(-50%)',
          width: 24, height: 24, borderRadius: '50%',
          background: '#1e2a45', border: '1px solid rgba(99,102,241,0.3)',
          color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 10,
        }}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </motion.button>
    </motion.aside>
  );
}
