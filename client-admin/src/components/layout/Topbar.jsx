import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import useAuthStore from '../../store/authStore';

export default function Topbar({ onMenuToggle }) {
  const { user } = useAuthStore();

  return (
    <header style={{
      height: 72,
      background: 'rgba(10, 13, 20, 0.9)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(99, 102, 241, 0.12)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={onMenuToggle} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex' }}>
          <Menu size={22} />
        </button>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#4b5563' }} />
          <input
            type="text"
            placeholder="Search customers, tickets..."
            style={{
              background: 'rgba(30, 42, 69, 0.6)',
              border: '1px solid rgba(99, 102, 241, 0.15)',
              borderRadius: 10,
              padding: '0.5rem 1rem 0.5rem 2.5rem',
              color: '#f1f5f9',
              fontSize: '0.875rem',
              width: 260,
              outline: 'none',
              fontFamily: 'Inter, sans-serif',
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button style={{
          background: 'rgba(30, 42, 69, 0.6)',
          border: '1px solid rgba(99,102,241,0.15)',
          borderRadius: 10, width: 40, height: 40,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#94a3b8', cursor: 'pointer', position: 'relative'
        }}>
          <Bell size={18} />
          <span style={{
            position: 'absolute', top: 8, right: 8, width: 8, height: 8,
            background: '#ef4444', borderRadius: '50%', border: '2px solid #0a0d14'
          }} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.875rem', fontWeight: 700, color: 'white'
          }}>
            {(user?.fullName || user?.username || 'A').charAt(0).toUpperCase()}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f1f5f9' }}>{user?.fullName || user?.username}</span>
            <span style={{ fontSize: '0.7rem', color: '#6366f1', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {user?.role?.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
