import { useState } from 'react';
import { ArrowLeft, Heart, BarChart2, ChevronDown } from 'lucide-react';

function QAItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px', marginBottom: '12px' }}>
      <button onClick={() => setOpen(v => !v)} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0, gap: '12px',
      }}>
        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', textAlign: 'left' }}>{q}</span>
        <ChevronDown size={16} color="var(--text-secondary)"
          style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }} />
      </button>
      {open && <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: '10px' }}>{a}</p>}
    </div>
  );
}

function SectionTitle({ children }) {
  return <h2 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px' }}>{children}</h2>;
}

export default function CreationView({ creation, artist, onBack }) {
  const [liked, setLiked] = useState(false);

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
        <h1 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{creation.title}</h1>
      </div>

      {/* Cover hero */}
      <div style={{ position: 'relative', height: '45dvh' }}>
        <img src={creation.cover} alt={creation.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, var(--bg-base) 0%, transparent 50%)' }} />
      </div>

      <div style={{ padding: '0 var(--page-h)' }}>

        {/* 1. Nom + type */}
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px', letterSpacing: '-0.3px' }}>
            {creation.title}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            {creation.type} · {creation.year}{creation.tracks ? ` · ${creation.tracks} titres` : ''}
          </p>
        </div>

        {/* 2. Citation */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--r-card-lg)', padding: '16px', marginBottom: '20px',
          borderLeft: '3px solid var(--accent)',
        }}>
          <p style={{ fontSize: '15px', fontStyle: 'italic', color: 'var(--text-primary)', lineHeight: 1.6 }}>
            {creation.citation}
          </p>
          <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '8px' }}>— {artist.name}</p>
        </div>

        {/* 3. Métriques */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
          <div style={{
            flex: 1, padding: '14px', borderRadius: 'var(--r-card)',
            background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <BarChart2 size={18} color="var(--accent)" strokeWidth={1.8} />
            <div>
              <p style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>{creation.streams}</p>
              <p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>streams</p>
            </div>
          </div>
          <div style={{
            flex: 1, padding: '14px', borderRadius: 'var(--r-card)',
            background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
            display: 'flex', alignItems: 'center', gap: '8px',
            cursor: 'pointer',
          }} onClick={() => setLiked(v => !v)}>
            <Heart size={18} color={liked ? '#FF5C8A' : 'var(--text-secondary)'}
              fill={liked ? '#FF5C8A' : 'none'} strokeWidth={1.8} />
            <div>
              <p style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>{creation.likes}</p>
              <p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>likes</p>
            </div>
          </div>
        </div>

        {/* 4. Processus créatif */}
        <div style={{ marginBottom: '24px' }}>
          <SectionTitle>Processus créatif</SectionTitle>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{creation.processus}</p>
        </div>

        {/* 5. Univers créatif (visuels placeholder) */}
        <div style={{ marginBottom: '24px' }}>
          <SectionTitle>Univers créatif</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {[
              'linear-gradient(135deg, #1a0533, #6b21a8)',
              'linear-gradient(135deg, #0f172a, #1e3a5f)',
              'linear-gradient(135deg, #2d6a4f, #52b788)',
            ].map((g, i) => (
              <div key={i} style={{
                height: i === 0 ? 160 : 76,
                gridColumn: i === 0 ? '1 / -1' : 'auto',
                borderRadius: 'var(--r-card)', background: g,
              }} />
            ))}
          </div>
        </div>

        {/* 6. Inspirations */}
        {creation.inspirations && (
          <div style={{ marginBottom: '24px' }}>
            <SectionTitle>Inspirations</SectionTitle>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {creation.inspirations.map(name => (
                <span key={name} style={{
                  fontSize: '13px', padding: '6px 14px', borderRadius: 'var(--r-pill)',
                  background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                }}>{name}</span>
              ))}
            </div>
          </div>
        )}

        {/* 7. Q & A */}
        {creation.qAndA && (
          <div>
            <SectionTitle>Q &amp; A</SectionTitle>
            {creation.qAndA.map(({ q, a }, i) => <QAItem key={i} q={q} a={a} />)}
          </div>
        )}

      </div>
    </div>
  );
}
