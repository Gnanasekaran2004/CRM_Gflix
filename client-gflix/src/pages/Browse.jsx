import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, Play, Info, Plus, Check, LogOut, Tv, User, HelpCircle, ChevronRight, Lock, Crown } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useCustomerAuthStore from '../store/customerAuthStore';
import gflixApi from '../api/gflixClient';

const contentRows = [
  {
    title: 'Trending Now',
    items: [
      { id: 1, title: 'Stranger Things', genre: 'Sci-Fi', img: 'https://picsum.photos/400/225?random=1' },
      { id: 2, title: 'The Crown', genre: 'Drama', img: 'https://picsum.photos/400/225?random=2' },
      { id: 3, title: 'Ozark', genre: 'Thriller', img: 'https://picsum.photos/400/225?random=3' },
      { id: 4, title: 'Squid Game', genre: 'Korean Drama', img: 'https://picsum.photos/400/225?random=4' },
      { id: 5, title: 'Wednesday', genre: 'Comedy', img: 'https://picsum.photos/400/225?random=5' },
      { id: 6, title: 'The Witcher', genre: 'Fantasy', img: 'https://picsum.photos/400/225?random=6' },
    ]
  },
  {
    title: 'New Releases',
    items: [
      { id: 7, title: 'Rebel Moon', genre: 'Action', img: 'https://picsum.photos/400/225?random=7' },
      { id: 8, title: 'Leave the World Behind', genre: 'Thriller', img: 'https://picsum.photos/400/225?random=8' },
      { id: 9, title: 'The Fall of the House of Usher', genre: 'Horror', img: 'https://picsum.photos/400/225?random=9' },
      { id: 10, title: 'Lift', genre: 'Comedy', img: 'https://picsum.photos/400/225?random=10' },
      { id: 11, title: 'Society of the Snow', genre: 'Drama', img: 'https://picsum.photos/400/225?random=11' },
      { id: 12, title: 'AVATAR: The Way of Water', genre: 'Sci-Fi', img: 'https://picsum.photos/400/225?random=12' },
    ]
  },
  {
    title: 'Action & Adventure',
    items: [
      { id: 13, title: 'Extraction 2', genre: 'Action', img: 'https://picsum.photos/400/225?random=13' },
      { id: 14, title: 'The Gray Man', genre: 'Spy', img: 'https://picsum.photos/400/225?random=14' },
      { id: 15, title: 'Project Power', genre: 'Superhero', img: 'https://picsum.photos/400/225?random=15' },
      { id: 16, title: 'Triple Frontier', genre: 'Action', img: 'https://picsum.photos/400/225?random=16' },
      { id: 17, title: 'The Old Guard', genre: 'Fantasy Action', img: 'https://picsum.photos/400/225?random=17' },
      { id: 18, title: 'Bird Box', genre: 'Thriller', img: 'https://picsum.photos/400/225?random=18' },
    ]
  },
  {
    title: '4K Ultra HD — Premium Only',
    premium: true,
    items: [
      { id: 19, title: 'Planet Earth III', genre: 'Documentary 4K', img: 'https://picsum.photos/400/225?random=19' },
      { id: 20, title: 'Dune: Part Two', genre: 'Epic Sci-Fi 4K', img: 'https://picsum.photos/400/225?random=20' },
      { id: 21, title: 'Oppenheimer', genre: 'Historical Drama 4K', img: 'https://picsum.photos/400/225?random=21' },
      { id: 22, title: 'The Batman', genre: 'Superhero 4K', img: 'https://picsum.photos/400/225?random=22' },
    ]
  },
];

function ContentCard({ item, isInList, onToggle, locked }) {
  return (
    <div
      style={{
        minWidth: 200, height: 120, borderRadius: 8,
        overflow: 'hidden', position: 'relative', flexShrink: 0,
        cursor: locked ? 'default' : 'pointer', transition: 'transform 0.3s ease',
      }}
      onMouseEnter={e => { if (!locked) e.currentTarget.style.transform = 'scale(1.08)'; }}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: locked ? 'brightness(0.3) blur(2px)' : 'none' }} />
      {locked ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
          <Lock size={20} color="rgba(255,255,255,0.7)" />
          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>Premium</div>
        </div>
      ) : (
        <>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)', opacity: 0, transition: 'opacity 0.3s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = 1}
            onMouseLeave={e => e.currentTarget.style.opacity = 0}
          />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0.5rem', transform: 'translateY(100%)', transition: 'transform 0.3s', background: 'rgba(0,0,0,0.85)' }}
            className="card-info">
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>{item.title}</div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>{item.genre}</div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onToggle(item.id); }}
            style={{
              position: 'absolute', bottom: 8, right: 8,
              width: 28, height: 28, borderRadius: '50%',
              background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.4)',
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            {isInList ? <Check size={14} /> : <Plus size={14} />}
          </button>
        </>
      )}
    </div>
  );
}

export default function Browse() {
  const { customer, logout } = useCustomerAuthStore();
  const navigate = useNavigate();
  const [myList, setMyList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ['customerProfile'],
    queryFn: () => gflixApi.get('/api/customer-auth/me').then(r => r.data),
    refetchInterval: 60000,
  });

  const isPremium = profile?.plan?.name === 'Premium';
  const isActive = profile?.subscriptionStatus === 'ACTIVE' || profile?.subscriptionStatus === 'TRIAL';
  const isChurned = profile?.subscriptionStatus === 'CHURNED';

  const toggleList = (id) => setMyList(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const allItems = contentRows.flatMap(r => r.items);
  const searchResults = searchTerm
    ? allItems.filter(i => i.title.toLowerCase().includes(searchTerm.toLowerCase()) || i.genre.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={{ background: '#141414', minHeight: '100vh' }}>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)',
        padding: '1rem 3rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'background 0.3s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          <Link to="/browse" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <Tv size={22} color="#e50914" />
            <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#e50914', letterSpacing: '-0.5px' }}>GFLIX</span>
          </Link>
          <ul style={{ display: 'flex', gap: '1.5rem', listStyle: 'none', color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem' }}>
            {['Home', 'Series', 'Films', 'New & Popular'].map(item => (
              <li key={item} style={{ cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#fff'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.75)'}>
                {item}
              </li>
            ))}
            <li style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.75)' }}>My List ({myList.length})</li>
          </ul>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {profile?.plan && (
            <span style={{
              fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 99,
              background: isPremium ? 'rgba(245,158,11,0.2)' : 'rgba(99,102,241,0.15)',
              color: isPremium ? '#f59e0b' : '#818cf8',
              border: `1px solid ${isPremium ? 'rgba(245,158,11,0.3)' : 'rgba(99,102,241,0.25)'}`,
              display: 'flex', alignItems: 'center', gap: 4
            }}>
              {isPremium && <Crown size={10} />}
              {profile.plan.name}
            </span>
          )}
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
            <input
              type="text"
              placeholder="Search titles..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 4, padding: '0.4rem 1rem 0.4rem 2.25rem',
                color: '#fff', fontSize: '0.875rem', outline: 'none',
                width: searchTerm ? 220 : 140, transition: 'width 0.3s',
              }}
            />
          </div>
          <Bell size={20} color="rgba(255,255,255,0.8)" style={{ cursor: 'pointer' }} />
          <div style={{ position: 'relative' }}>
            <div onClick={() => setShowUserMenu(p => !p)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <div style={{ width: 32, height: 32, borderRadius: 4, background: 'linear-gradient(135deg, #e50914, #8b0000)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.875rem' }}>
                {(customer?.name || 'G').charAt(0).toUpperCase()}
              </div>
              <ChevronRight size={14} style={{ color: 'rgba(255,255,255,0.6)', transform: showUserMenu ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
            </div>
            {showUserMenu && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                style={{ position: 'absolute', right: 0, top: '100%', marginTop: 8, background: 'rgba(0,0,0,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, minWidth: 220, zIndex: 200 }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{customer?.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{customer?.email}</div>
                  {profile?.subscriptionStatus && (
                    <div style={{ marginTop: '0.375rem', fontSize: '0.7rem', fontWeight: 700, color: profile.subscriptionStatus === 'ACTIVE' ? '#10b981' : profile.subscriptionStatus === 'TRIAL' ? '#f59e0b' : '#ef4444' }}>
                      ● {profile.subscriptionStatus}
                    </div>
                  )}
                </div>
                {[
                  [User, 'My Account', '/account'],
                  [HelpCircle, 'Support', '/support'],
                ].map(([Icon, label, to]) => (
                  <Link key={label} to={to} onClick={() => setShowUserMenu(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.875rem', transition: 'background 0.2s' }}>
                    <Icon size={16} />
                    {label}
                  </Link>
                ))}
                <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', color: '#e50914', background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', fontSize: '0.875rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <LogOut size={16} />
                  Sign Out
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </nav>

      {isChurned && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, background: 'rgba(239,68,68,0.95)', backdropFilter: 'blur(8px)', padding: '0.875rem 3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', fontSize: '0.9rem', fontWeight: 600, marginTop: 60 }}>
          <span>⚠️ Your subscription has been cancelled. Content access is restricted.</span>
          <Link to="/support" style={{ color: '#fff', textDecoration: 'underline', fontWeight: 800 }}>Contact Support</Link>
        </div>
      )}

      {!searchTerm && isActive && (
        <div style={{ position: 'relative', height: '80vh', overflow: 'hidden' }}>
          <img
            src="https://picsum.photos/1920/1080?random=99"
            alt="Hero"
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.5)' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(20,20,20,0.9) 30%, transparent 70%), linear-gradient(to top, rgba(20,20,20,0.9) 0%, transparent 50%)' }} />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ position: 'absolute', bottom: '20%', left: '3rem', maxWidth: 550 }}
          >
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e50914', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>🔥 #1 in India Today</div>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1.05, marginBottom: '1rem', textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>Stranger<br />Things</h1>
            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="gflix-btn gflix-btn-white" style={{ fontSize: '1rem', padding: '0.75rem 2rem' }}>
                <Play size={20} fill="currentColor" /> Play
              </button>
              <button className="gflix-btn gflix-btn-ghost" style={{ fontSize: '1rem', padding: '0.75rem 2rem' }}>
                <Info size={20} /> More Info
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {!searchTerm && isChurned && (
        <div style={{ height: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ fontSize: '4rem' }}>🔒</div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.6)' }}>Subscription Expired</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', maxWidth: 400 }}>Your subscription has been cancelled. Contact support to reactivate your account and regain full access.</p>
          <Link to="/support" className="gflix-btn gflix-btn-red" style={{ marginTop: '0.5rem' }}>
            Contact Support
          </Link>
        </div>
      )}

      <div style={{ padding: searchTerm ? '6rem 3rem 3rem' : '0 3rem 3rem', marginTop: searchTerm ? 0 : (!searchTerm && isActive ? -120 : 80), position: 'relative', zIndex: 10 }}>
        {searchTerm ? (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Results for "{searchTerm}"</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
              {searchResults.map(item => (
                <ContentCard key={item.id} item={item} isInList={myList.includes(item.id)} onToggle={toggleList} locked={isChurned} />
              ))}
              {searchResults.length === 0 && (
                <p style={{ color: 'rgba(255,255,255,0.5)', gridColumn: '1/-1' }}>No results found for "{searchTerm}".</p>
              )}
            </div>
          </div>
        ) : (
          <>
            {contentRows.map(row => {
              const isRowLocked = row.premium && !isPremium;
              return (
                <div key={row.title} style={{ marginBottom: '3rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.875rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#e5e5e5' }}>{row.title}</h2>
                    {row.premium && !isPremium && (
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.6rem', borderRadius: 99, background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Crown size={10} /> Premium Only
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '1rem' }} className="scrollbar-hide">
                    {row.items.map(item => (
                      <ContentCard key={item.id} item={item} isInList={myList.includes(item.id)} onToggle={toggleList} locked={isRowLocked || isChurned} />
                    ))}
                  </div>
                  {isRowLocked && (
                    <div style={{ fontSize: '0.8rem', color: '#f59e0b', marginTop: '0.375rem' }}>
                      🔒 Upgrade to Premium to unlock 4K content
                    </div>
                  )}
                </div>
              );
            })}
            {myList.length > 0 && !isChurned && (
              <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.875rem', color: '#e5e5e5' }}>My List</h2>
                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '1rem' }} className="scrollbar-hide">
                  {allItems.filter(i => myList.includes(i.id)).map(item => (
                    <ContentCard key={item.id} item={item} isInList={true} onToggle={toggleList} locked={false} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
