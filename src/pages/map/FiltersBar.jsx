import { useState } from 'react';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { TYPE_LABELS, GENRE_LABELS } from '../../data/mapData.js';

const PERIODS = [
  { id: 'for_you',  label: 'Pour toi' },
  { id: 'tonight',  label: 'Ce soir' },
  { id: 'weekend',  label: 'Ce week-end' },
  { id: 'month',    label: 'Ce mois' },
];

const ARTIST_GENRES = [
  { id: 'all',       label: 'Pour toi' },
  { id: 'rap',       label: 'Rap' },
  { id: 'rnb',       label: 'R&B' },
  { id: 'electronic',label: 'Électro' },
  { id: 'pop',       label: 'Pop' },
  { id: 'variete',   label: 'Variété' },
  { id: 'rock',      label: 'Rock' },
];

const SORT_OPTIONS = [
  { id: 'top',      label: 'Plus écoutés' },
  { id: 'trending', label: 'En hausse' },
  { id: 'new',      label: 'Nouveaux entrants' },
];

export default function FiltersBar({ mode, onModeChange, filters, onFiltersChange, artistFilters, onArtistFiltersChange, onBack }) {
  const [showTypeMenu, setShowTypeMenu]   = useState(false);
  const [showGenreMenu, setShowGenreMenu] = useState(false);
  const [showSortMenu, setShowSortMenu]   = useState(false);

  const pill = (active) => ({
    flexShrink: 0,
    padding: '7px 14px',
    borderRadius: 'var(--r-pill)',
    border: `1px solid ${active ? 'rgba(162,56,255,0.6)' : 'rgba(255,255,255,0.08)'}`,
    background: active ? 'rgba(162,56,255,0.15)' : 'rgba(30,30,38,0.5)',
    color: active ? '#fff' : 'var(--text-secondary)',
    fontSize: '13px', fontWeight: active ? 600 : 400,
    cursor: 'pointer', whiteSpace: 'nowrap',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    transition: 'all var(--t-fast)',
    display: 'flex', alignItems: 'center', gap: '4px',
  });

  return (
    <div style={{ padding: '12px 0 10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

      {/* Row 1 : retour + toggle mode */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 var(--page-h)' }}>
        <button onClick={onBack} style={{ background: 'rgba(30,30,38,0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
          <ArrowLeft size={18} color="var(--text-primary)" />
        </button>

        {/* Toggle Events / Artistes */}
        <div style={{ display: 'flex', background: 'rgba(30,30,38,0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--r-pill)', padding: '3px', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
          {['events', 'artists'].map(m => (
            <button key={m} onClick={() => onModeChange(m)} style={{
              padding: '7px 18px', borderRadius: 'var(--r-pill)',
              background: mode === m ? 'rgba(255,255,255,0.1)' : 'transparent',
              border: 'none', cursor: 'pointer',
              color: mode === m ? '#fff' : 'var(--text-secondary)',
              fontSize: '13px', fontWeight: mode === m ? 700 : 400,
              transition: 'all var(--t-fast)',
            }}>
              {m === 'events' ? 'Événements' : 'Artistes'}
            </button>
          ))}
        </div>
      </div>

      {/* Row 2 : pills filtres mode artistes */}
      {mode === 'artists' && artistFilters && (
        <div style={{ display: 'flex', gap: '8px', paddingLeft: 'var(--page-h)', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {/* Genre pills */}
          {ARTIST_GENRES.map(g => (
            <button key={g.id} style={pill(artistFilters.genre === g.id)} onClick={() => onArtistFiltersChange({ ...artistFilters, genre: g.id })}>
              {g.label}
            </button>
          ))}
          {/* Tri ▾ */}
          <div style={{ position: 'relative', flexShrink: 0, paddingRight: 'var(--page-h)' }}>
            <button style={pill(artistFilters.sort !== 'top')} onClick={() => { setShowSortMenu(v => !v); }}>
              {SORT_OPTIONS.find(s => s.id === artistFilters.sort)?.label || 'Tri'}
              <ChevronDown size={13} style={{ transform: showSortMenu ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }} />
            </button>
            {showSortMenu && (
              <div style={{ position: 'absolute', top: '110%', right: 0, background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 'var(--r-card)', overflow: 'hidden', zIndex: 2000, minWidth: 170 }}>
                {SORT_OPTIONS.map(s => (
                  <button key={s.id} style={{ ...dropItem, color: artistFilters.sort === s.id ? 'var(--accent)' : 'var(--text-primary)' }} onClick={() => { onArtistFiltersChange({ ...artistFilters, sort: s.id }); setShowSortMenu(false); }}>
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Row 2 : pills filtres (seulement en mode events) */}
      {mode === 'events' && (
        <div style={{ display: 'flex', gap: '8px', paddingLeft: 'var(--page-h)', overflowX: 'auto', scrollbarWidth: 'none' }}>

          {/* Période */}
          {PERIODS.map(p => (
            <button key={p.id} style={pill(filters.period === p.id)} onClick={() => onFiltersChange({ ...filters, period: p.id })}>
              {p.label}
            </button>
          ))}

          {/* Type ▾ */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <button style={pill(filters.type !== 'all')} onClick={() => { setShowTypeMenu(v => !v); setShowGenreMenu(false); }}>
              {filters.type !== 'all' ? TYPE_LABELS[filters.type] : 'Type'}
              <ChevronDown size={13} style={{ transform: showTypeMenu ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }} />
            </button>
            {showTypeMenu && (
              <div style={{ position: 'absolute', top: '110%', left: 0, background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 'var(--r-card)', overflow: 'hidden', zIndex: 2000, minWidth: 130 }}>
                <button style={{ ...dropItem, color: filters.type === 'all' ? 'var(--accent)' : 'var(--text-primary)' }} onClick={() => { onFiltersChange({ ...filters, type: 'all' }); setShowTypeMenu(false); }}>Tous</button>
                {Object.entries(TYPE_LABELS).map(([k, v]) => (
                  <button key={k} style={{ ...dropItem, color: filters.type === k ? 'var(--accent)' : 'var(--text-primary)' }} onClick={() => { onFiltersChange({ ...filters, type: k }); setShowTypeMenu(false); }}>{v}</button>
                ))}
              </div>
            )}
          </div>

          {/* Genre ▾ */}
          <div style={{ position: 'relative', flexShrink: 0, paddingRight: 'var(--page-h)' }}>
            <button style={pill(filters.genre !== 'all')} onClick={() => { setShowGenreMenu(v => !v); setShowTypeMenu(false); }}>
              {filters.genre !== 'all' ? GENRE_LABELS[filters.genre] : 'Genre'}
              <ChevronDown size={13} style={{ transform: showGenreMenu ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }} />
            </button>
            {showGenreMenu && (
              <div style={{ position: 'absolute', top: '110%', left: 0, background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 'var(--r-card)', overflow: 'hidden', zIndex: 2000, minWidth: 130 }}>
                <button style={{ ...dropItem, color: filters.genre === 'all' ? 'var(--accent)' : 'var(--text-primary)' }} onClick={() => { onFiltersChange({ ...filters, genre: 'all' }); setShowGenreMenu(false); }}>Tous</button>
                {Object.entries(GENRE_LABELS).map(([k, v]) => (
                  <button key={k} style={{ ...dropItem, color: filters.genre === k ? 'var(--accent)' : 'var(--text-primary)' }} onClick={() => { onFiltersChange({ ...filters, genre: k }); setShowGenreMenu(false); }}>{v}</button>
                ))}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}

const dropItem = {
  display: 'block', width: '100%', padding: '10px 14px',
  background: 'none', border: 'none', cursor: 'pointer',
  fontSize: '13px', textAlign: 'left',
  borderBottom: '1px solid var(--border-subtle)',
};
