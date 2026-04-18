import { Home, Compass, Music, Search, Diamond } from 'lucide-react';

const tabs = [
  { id: 'home',    label: 'Accueil',      Icon: Home },
  { id: 'explore', label: 'Explorer',     Icon: Compass },
  { id: 'library', label: 'Bibliothèque', Icon: Music },
  { id: 'search',  label: 'Recherche',    Icon: Search },
  { id: 'premium', label: 'Premium',      Icon: Diamond },
];

export default function NavBar({ activeTab, onTabChange }) {
  return (
    <nav
      style={{
        position: 'sticky',
        bottom: 0,
        zIndex: 'var(--z-navbar)',
        height: 'var(--navbar-h, 60px)',
        background: 'var(--bg-base)',
        borderTop: '1px solid var(--border-subtle)',
        paddingBottom: 'env(safe-area-inset-bottom, 15px)',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '8px',
        justifyContent: 'space-around',
      }}
    >
      {tabs.map(({ id, label, Icon }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: isActive ? '#fff' : 'var(--text-tertiary)',
              padding: '0',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '32px',
                borderRadius: '16px',
                background: isActive ? 'var(--accent)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s',
              }}
            >
              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 2}
                color={isActive ? '#fff' : 'var(--text-tertiary)'}
                fill={isActive ? '#fff' : 'transparent'}
                style={{ transition: 'color 0.2s' }}
              />
            </div>
            <span
              style={{
                fontSize: '10px',
                fontWeight: isActive ? '600' : '500',
                lineHeight: 1,
                color: isActive ? '#fff' : 'var(--text-tertiary)',
                marginTop: '1px',
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
