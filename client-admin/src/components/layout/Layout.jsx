import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  const { data: requestStats } = useQuery({
    queryKey: ['requestStats'],
    queryFn: () => api.get('/api/requests/stats').then(r => r.data),
    refetchInterval: 30000,
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0d14' }}>
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(p => !p)}
        pendingCount={requestStats?.pending || 0}
      />
      <div style={{
        flex: 1,
        marginLeft: collapsed ? 72 : 260,
        transition: 'margin-left 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}>
        <Topbar onMenuToggle={() => setCollapsed(p => !p)} />
        <main style={{ flex: 1, padding: '2rem', maxWidth: 1400, width: '100%', margin: '0 auto', paddingTop: '2rem' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
