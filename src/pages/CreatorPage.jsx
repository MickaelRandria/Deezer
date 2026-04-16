import { useState } from 'react';
import {
  ArrowLeft, Home, BarChart2, Users, Globe,
  TrendingUp, Music, ListMusic, Tag, Settings,
  Truck, User, UserCog, HelpCircle, PlusCircle, ChevronRight,
} from 'lucide-react';

import AccueilSection     from './creator/AccueilSection.jsx';
import DeposerSection     from './creator/DeposerSection.jsx';
import PlaceholderSection from './creator/PlaceholderSection.jsx';

// ── Navigation structure ──────────────────────────────────
const NAV = [
  { id: 'home',     icon: Home,       label: 'Accueil' },
  {
    id: 'analytics', icon: BarChart2,  label: 'Analytics',
    children: [
      { id: 'stats',              icon: TrendingUp,  label: 'Stats' },
      { id: 'profil-artist',      icon: User,        label: 'Profil Artist' },
      { id: 'top-ecoute',         icon: Music,       label: 'Top écoute' },
      { id: 'rapport-playlist',   icon: ListMusic,   label: 'Rapport playlist' },
      { id: 'pitch',              icon: Tag,         label: 'Pitch' },
      { id: 'gestion',            icon: Settings,    label: 'Gestion des comptes' },
      { id: 'livraison',          icon: Truck,       label: 'Livraison' },
    ],
  },
  { id: 'audience',      icon: Users,      label: 'Audience' },
  { id: 'univers',       icon: Globe,      label: 'Univers' },
  { id: 'artist-profil', icon: User,       label: 'Artist Profil' },
  { id: 'user-manager',  icon: UserCog,    label: 'User manager' },
  { id: 'faq',           icon: HelpCircle, label: 'FAQ' },
];

// ── Placeholder configs ───────────────────────────────────
const PLACEHOLDERS = {
  upload:          { icon: PlusCircle, title: 'Déposer un titre',      description: 'Le parcours de dépôt complet arrive bientôt.' },
  stats:           { icon: TrendingUp, title: 'Stats',                 description: 'Suis tes streams, revenus et tendances en temps réel.' },
  'profil-artist': { icon: User,       title: 'Profil Artist',         description: 'Gère ton profil public sur Deezer.' },
  'top-ecoute':    { icon: Music,      title: 'Top écoute',            description: 'Découvre tes titres les plus streamés.' },
  'rapport-playlist': { icon: ListMusic, title: 'Rapport playlist',    description: 'Analyse la présence de tes titres en playlist.' },
  pitch:           { icon: Tag,        title: 'Pitch',                 description: 'Soumets tes sorties aux éditoriaux Deezer.' },
  gestion:         { icon: Settings,   title: 'Gestion des comptes',   description: 'Paramètres et accès de ton espace créateur.' },
  livraison:       { icon: Truck,      title: 'Livraison',             description: 'Suis la distribution de tes contenus.' },
  audience:        { icon: Users,      title: 'Audience',              description: 'Comprends qui écoute ta musique et d\'où ils viennent.' },
  'artist-profil': { icon: User,       title: 'Artist Profil',         description: 'Ton univers visuel et biographique public.' },
  'user-manager':  { icon: UserCog,    title: 'User manager',          description: 'Gère les accès et rôles de ton équipe.' },
  faq:             { icon: HelpCircle, title: 'FAQ',                   description: 'Toutes les réponses à tes questions.' },
};

// ── Nav button ────────────────────────────────────────────
function NavBtn({ id, icon: Icon, label, active, indent, onClick }) {
  return (
    <button
      onClick={() => onClick(id)}
      style={{
        display: 'flex', alignItems: 'center', gap: '9px',
        padding: indent ? '7px 10px 7px 22px' : '9px 10px',
        borderRadius: 'var(--r-card)',
        border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%',
        background: active ? 'var(--accent-alpha)' : 'transparent',
        color: active ? 'var(--accent)' : indent ? 'var(--text-tertiary)' : 'var(--text-secondary)',
        fontSize: indent ? '12px' : '13px',
        fontWeight: active ? 600 : 400,
        transition: 'background var(--t-fast), color var(--t-fast)',
      }}
    >
      <Icon size={indent ? 13 : 15} strokeWidth={active ? 2.5 : 1.6} style={{ flexShrink: 0 }} />
      <span style={{ flex: 1 }}>{label}</span>
    </button>
  );
}

// ── Collapsible group ─────────────────────────────────────
function NavGroup({ item, activeNav, openGroups, onToggle, onNavigate }) {
  const isOpen    = openGroups.includes(item.id);
  const Icon      = item.icon;
  const anyActive = item.children.some(c => c.id === activeNav);

  return (
    <>
      <button
        onClick={() => onToggle(item.id)}
        style={{
          display: 'flex', alignItems: 'center', gap: '9px',
          padding: '9px 10px', borderRadius: 'var(--r-card)',
          border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%',
          background: anyActive ? 'var(--accent-alpha)' : 'transparent',
          color: anyActive ? 'var(--accent)' : 'var(--text-secondary)',
          fontSize: '13px', fontWeight: anyActive ? 600 : 400,
          transition: 'background var(--t-fast), color var(--t-fast)',
        }}
      >
        <Icon size={15} strokeWidth={anyActive ? 2.5 : 1.6} style={{ flexShrink: 0 }} />
        <span style={{ flex: 1 }}>{item.label}</span>
        <ChevronRight
          size={13}
          color={anyActive ? 'var(--accent)' : 'var(--text-tertiary)'}
          style={{
            transition: 'transform var(--t-fast)',
            transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
            flexShrink: 0,
          }}
        />
      </button>

      {isOpen && item.children.map(child => (
        <NavBtn
          key={child.id}
          {...child}
          active={activeNav === child.id}
          indent
          onClick={onNavigate}
        />
      ))}
    </>
  );
}

// ── Separator ─────────────────────────────────────────────
function Sep() {
  return <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '6px 0' }} />;
}

// ── Main component ────────────────────────────────────────
export default function CreatorPage({ onExitCreatorMode }) {
  const [activeNav,   setActiveNav]   = useState('home');
  const [openGroups,  setOpenGroups]  = useState(['analytics']);

  function toggleGroup(id) {
    setOpenGroups(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  }

  function renderMain() {
    if (activeNav === 'home')   return <AccueilSection onNavigate={setActiveNav} />;
    if (activeNav === 'upload') return <DeposerSection onClose={() => setActiveNav('home')} />;
    const ph = PLACEHOLDERS[activeNav];
    if (ph) return <PlaceholderSection icon={ph.icon} title={ph.title} description={ph.description} />;
    return null;
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100dvh', width: '100%',
      background: 'var(--bg-base)', color: 'var(--text-primary)',
      fontFamily: 'var(--font-primary)',
    }}>

      {/* ── Header ─────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', height: '60px', flexShrink: 0,
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <button
          onClick={onExitCreatorMode}
          style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500,
            padding: '6px 10px', borderRadius: 'var(--r-card)',
          }}
        >
          <ArrowLeft size={16} strokeWidth={2} />
          <span>App</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{
                width: 4, borderRadius: 2,
                height: [10, 16, 12, 8][i],
                background: ['#A238FF','#FF5C8A','#A238FF','#FF5C8A'][i],
              }} />
            ))}
          </div>
          <div>
            <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>
              deezer
            </span>
            <span style={{ fontSize: '10px', color: 'var(--accent)', display: 'block', fontWeight: 600, letterSpacing: '0.06em', marginTop: '-3px' }}>
              for Creators
            </span>
          </div>
        </div>

        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: 'linear-gradient(135deg, #A238FF 0%, #FF5C8A 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '13px', fontWeight: 800, color: '#fff',
        }}>N</div>
      </div>

      {/* ── Body ───────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Sidebar */}
        <nav style={{
          width: 220, flexShrink: 0,
          borderRight: '1px solid var(--border-subtle)',
          padding: '12px 8px',
          display: 'flex', flexDirection: 'column', gap: '2px',
          overflowY: 'auto',
        }}>
          {NAV.map((item) => (
            <div key={item.id}>
              {/* Séparateurs */}
              {item.id === 'audience' && <Sep />}
              {item.id === 'univers'  && <Sep />}

              {item.children ? (
                <NavGroup
                  item={item}
                  activeNav={activeNav}
                  openGroups={openGroups}
                  onToggle={toggleGroup}
                  onNavigate={setActiveNav}
                />
              ) : (
                <NavBtn
                  {...item}
                  active={activeNav === item.id}
                  onClick={setActiveNav}
                />
              )}
            </div>
          ))}

          {/* Déposer — CTA mis en avant */}
          <Sep />
          <button
            onClick={() => setActiveNav('upload')}
            style={{
              display: 'flex', alignItems: 'center', gap: '9px',
              padding: '10px 12px', borderRadius: 'var(--r-card)',
              border: 'none', cursor: 'pointer', width: '100%',
              background: activeNav === 'upload' ? 'var(--gradient-flow)' : 'var(--accent)',
              color: '#fff',
              fontSize: '13px', fontWeight: 700,
              transition: 'opacity var(--t-fast)',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <PlusCircle size={15} strokeWidth={2.5} style={{ flexShrink: 0 }} />
            <span>Déposer</span>
          </button>
        </nav>

        {/* Zone principale */}
        <main style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {renderMain()}
        </main>
      </div>
    </div>
  );
}
