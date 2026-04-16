import { useState } from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';

const FILTERS = ['Tous', 'Albums', 'Sons', 'Projets'];

export default function BackstageView({ artist, onBack, onSelectCreation }) {
  const [filter, setFilter] = useState('Tous');

  const filtered = filter === 'Tous'
    ? artist.backstageCreations
    : artist.backstageCreations.filter(c =>
        filter === 'Albums' ? (c.type === 'Album' || c.type === 'EP') :
        filter === 'Sons'   ? c.type === 'Son' :
        c.type === 'Projet'
      );

  return (
    <div style={{ paddingBottom: '32px' }}>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '16px var(--page-h)', borderBottom: '1px solid var(--border-subtle)',
        position: 'sticky', top: 0, background: 'var(--bg-base)', zIndex: 10,
      }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 0 }}>
          <ArrowLeft size={22} color="var(--text-primary)" />
        </button>
        <h1 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)' }}>Backstage</h1>
      </div>

      <div style={{ padding: '20px var(--page-h) 0' }}>

        {/* Intro */}
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
          Dans les coulisses des créations de {artist.name} — processus, inspirations, anecdotes.
        </p>

        {/* Filtres */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {FILTERS.map(f => {
            const active = filter === f;
            return (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '7px 16px', borderRadius: 'var(--r-card)',
                border: active ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
                background: active ? 'var(--accent)' : 'transparent',
                color: active ? '#fff' : 'var(--text-secondary)',
                fontSize: '13px', fontWeight: active ? 600 : 400,
                cursor: 'pointer', transition: 'all var(--t-fast)',
              }}>{f}</button>
            );
          })}
        </div>

        {/* Liste des créations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {(filtered || []).map(creation => (
            <div key={creation.id} onClick={() => onSelectCreation(creation)} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--r-card-lg)', overflow: 'hidden', cursor: 'pointer',
            }}>
              {/* Cover band */}
              <div style={{ position: 'relative', height: 120 }}>
                <img src={creation.cover} alt={creation.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)' }} />
                <div style={{ position: 'absolute', bottom: '12px', left: '14px', right: '14px' }}>
                  <p style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>{creation.title}</p>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>{creation.type} · {creation.year}</p>
                </div>
              </div>
              {/* Preview citation */}
              <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <p style={{ flex: 1, fontSize: '13px', fontStyle: 'italic', color: 'var(--text-secondary)',
                  overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {creation.citation}
                </p>
                <ChevronRight size={16} color="var(--text-tertiary)" style={{ flexShrink: 0 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
