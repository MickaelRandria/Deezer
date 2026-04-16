import { useState } from 'react';
import {
  X, Music2, Mic, ListMusic, ChevronDown, Calendar,
  Check, MoreHorizontal, CloudUpload, ChevronRight,
} from 'lucide-react';
import { MOOD_ICONS } from '../../components/DeezerIcons.jsx';

const CONTENT_TYPES = [
  { id: 'album',    label: 'Album',    icon: Music2 },
  { id: 'podcast',  label: 'Podcast',  icon: Mic },
  { id: 'playlist', label: 'Playlist', icon: ListMusic },
];

const MOODS = [
  { id: 'chill',      label: 'Chill',      icon: 'chill' },
  { id: 'goodVibes',  label: 'Good vibes', icon: 'goodVibes' },
  { id: 'love',       label: 'Love',       icon: 'love' },
  { id: 'soiree',     label: 'Soirée',     icon: 'soiree' },
  { id: 'focus',      label: 'Focus',      icon: 'focus' },
  { id: 'motivation', label: 'Motivation', icon: 'motivation' },
];

const COUNTRIES = ['France', 'Belgique', 'Suisse', 'Canada', 'International'];

// ── Helpers ──────────────────────────────────────────────
function Label({ children, hint }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
      <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{children}</span>
      {hint && (
        <span style={{
          width: 16, height: 16, borderRadius: '50%',
          background: 'var(--bg-pressed)', border: '1px solid var(--border-default)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '10px', color: 'var(--text-tertiary)', cursor: 'help',
        }}>?</span>
      )}
    </div>
  );
}

function Input({ placeholder, value, onChange }) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%', padding: '13px 16px',
        background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--r-card)', color: 'var(--text-primary)',
        fontSize: '14px', outline: 'none', fontFamily: 'var(--font-primary)',
        transition: 'border-color var(--t-fast)',
        boxSizing: 'border-box',
      }}
      onFocus={e => e.target.style.borderColor = 'var(--accent)'}
      onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'}
    />
  );
}

function Textarea({ placeholder, value, onChange, rows = 3 }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: '100%', padding: '13px 16px',
        background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--r-card)', color: 'var(--text-primary)',
        fontSize: '14px', outline: 'none', fontFamily: 'var(--font-primary)',
        resize: 'none', lineHeight: 1.6,
        transition: 'border-color var(--t-fast)',
        boxSizing: 'border-box',
      }}
      onFocus={e => e.target.style.borderColor = 'var(--accent)'}
      onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'}
    />
  );
}

// ── Main component ────────────────────────────────────────
export default function DeposerSection({ onClose }) {
  const [contentType, setContentType] = useState('album');
  const [albumName, setAlbumName]     = useState('');
  const [country, setCountry]         = useState('France');
  const [date, setDate]               = useState('12 avril 2024');
  const [notes, setNotes]             = useState('');
  const [moods, setMoods]             = useState(['chill']);
  const [inspirations, setInspirations] = useState('');
  const [dragOver, setDragOver]       = useState(false);

  function toggleMood(id) {
    setMoods(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  }

  // Aperçu dynamique
  const titlesCount = 4;
  const releaseDate = '10 avril 2024';
  const duration    = '12 min';

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      padding: '32px 40px', gap: '0',
    }}>

      {/* ── Header ─────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '28px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Deezer icon */}
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'var(--gradient-flow)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Music2 size={17} color="#fff" strokeWidth={2.5} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>
            Ajouter un contenu
          </h2>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X size={16} color="var(--text-secondary)" />
          </button>
        )}
      </div>

      {/* ── Contenu (2 colonnes) ──────────────────────────────── */}
      <div style={{ display: 'flex', gap: '32px', flex: 1, minHeight: 0 }}>

        {/* Colonne gauche — Formulaire */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto', paddingRight: '8px' }}>

          {/* Type tabs */}
          <div style={{
            display: 'flex', gap: '4px',
            background: 'var(--bg-elevated)', padding: '4px',
            borderRadius: 'var(--r-card)', alignSelf: 'flex-start',
          }}>
            {CONTENT_TYPES.map(({ id, label, icon: Icon }) => {
              const active = contentType === id;
              return (
                <button
                  key={id}
                  onClick={() => setContentType(id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '7px',
                    padding: '9px 16px', borderRadius: 'var(--r-card)',
                    border: active ? '1px solid rgba(162,56,255,0.4)' : '1px solid transparent',
                    background: active ? 'var(--accent-alpha)' : 'transparent',
                    color: active ? 'var(--accent)' : 'var(--text-secondary)',
                    fontSize: '14px', fontWeight: active ? 700 : 500,
                    cursor: 'pointer', transition: 'all var(--t-fast)',
                  }}
                >
                  <Icon size={15} strokeWidth={active ? 2.5 : 1.8} />
                  {label}
                </button>
              );
            })}
          </div>

          {/* Nom */}
          <div>
            <Label>Nom de l'album</Label>
            <Input
              placeholder="Nom de l'album"
              value={albumName}
              onChange={setAlbumName}
            />
          </div>

          {/* Pays + Date */}
          <div>
            <Label hint>Pays disponible / Date de sortie</Label>
            <div style={{ display: 'flex', gap: '12px' }}>
              {/* Pays dropdown */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '11px 14px', borderRadius: 'var(--r-card)',
                background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
                cursor: 'pointer', flex: '0 0 160px',
              }}>
                <span style={{ fontSize: '16px' }}>🇫🇷</span>
                <span style={{ fontSize: '14px', color: 'var(--text-primary)', flex: 1 }}>{country}</span>
                <ChevronDown size={14} color="var(--text-secondary)" />
              </div>

              {/* Date picker */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '11px 14px', borderRadius: 'var(--r-card)',
                background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
                cursor: 'pointer', flex: 1,
              }}>
                <Calendar size={15} color="var(--text-secondary)" />
                <span style={{ fontSize: '14px', color: 'var(--text-primary)', flex: 1 }}>{date}</span>
                <ChevronDown size={14} color="var(--text-secondary)" />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label>Notes sur la création</Label>
            <Textarea
              placeholder="Écrivez ici quelque chose sur le processus ou les inspirations de l'album..."
              value={notes}
              onChange={setNotes}
              rows={4}
            />
          </div>

          {/* Mood */}
          <div>
            <Label hint>Mood</Label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {MOODS.map(({ id, label, icon }) => {
                const active = moods.includes(id);
                const MoodIcon = MOOD_ICONS[icon];
                return (
                  <button
                    key={id}
                    onClick={() => toggleMood(id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '7px',
                      padding: '7px 14px', borderRadius: 'var(--r-card)',
                      border: active ? '1px solid var(--accent)' : '1px solid var(--border-default)',
                      background: active ? 'var(--accent)' : 'var(--bg-elevated)',
                      color: active ? '#ffffff' : 'var(--text-secondary)',
                      fontSize: '13px', fontWeight: active ? 600 : 400,
                      cursor: 'pointer', transition: 'all var(--t-fast)',
                    }}
                  >
                    {active
                      ? <Check size={13} strokeWidth={3} color="#ffffff" />
                      : MoodIcon && (
                          <span style={{ opacity: 0.7 }}>
                            <MoodIcon size={14} />
                          </span>
                        )
                    }
                    {label}
                  </button>
                );
              })}
              <button style={{
                padding: '8px 14px', borderRadius: 'var(--r-card)',
                border: '1px solid var(--border-default)', background: 'var(--bg-elevated)',
                color: 'var(--text-secondary)', cursor: 'pointer',
                display: 'flex', alignItems: 'center',
              }}>
                <MoreHorizontal size={16} color="var(--text-secondary)" />
              </button>
            </div>
          </div>

          {/* Inspirations */}
          <div>
            <Label>Inspirations / Références</Label>
            <Textarea
              placeholder="Écrivez vos inspirations ici..."
              value={inspirations}
              onChange={setInspirations}
              rows={3}
            />
          </div>
        </div>

        {/* Colonne droite — Aperçu */}
        <div style={{
          width: 320, flexShrink: 0,
          display: 'flex', flexDirection: 'column', gap: '16px',
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>Aperçu</h3>

          {/* Stats pills */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {[
              { value: `${titlesCount} titres`, sub: 'Presses' },
              { value: releaseDate,             sub: 'Date de sortie' },
              { value: duration,                sub: 'Durée découte' },
            ].map(({ value, sub }) => (
              <div key={sub} style={{
                background: 'var(--bg-elevated)', borderRadius: 'var(--r-card)',
                border: '1px solid var(--border-subtle)', padding: '12px 10px',
                textAlign: 'center',
              }}>
                <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>{value}</p>
                <p style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{sub}</p>
              </div>
            ))}
          </div>

          {/* Titre le plus populaire */}
          <div>
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '10px' }}>
              Titre le plus populaire
            </p>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              background: 'var(--bg-elevated)', borderRadius: 'var(--r-card)',
              border: '1px solid var(--border-subtle)', padding: '12px',
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: 'var(--r-card)', flexShrink: 0,
                background: 'linear-gradient(135deg, #1a1a3e, #6b21a8, #ec4899)',
              }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Daniel Marjon</p>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>28k écoutes</p>
              </div>
              <ChevronRight size={16} color="var(--text-tertiary)" />
            </div>
          </div>

          {/* Upload zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); }}
            style={{
              flex: 1, minHeight: 140,
              border: `2px dashed ${dragOver ? 'var(--accent)' : 'var(--border-default)'}`,
              borderRadius: 'var(--r-card-lg)',
              background: dragOver ? 'var(--accent-alpha)' : 'var(--bg-elevated)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '10px',
              cursor: 'pointer', transition: 'all var(--t-fast)',
            }}
          >
            <CloudUpload size={40} color={dragOver ? 'var(--accent)' : 'var(--text-tertiary)'} strokeWidth={1.5} />
            <p style={{ fontSize: '15px', fontWeight: 700, color: dragOver ? 'var(--accent)' : 'var(--text-secondary)' }}>
              Upload
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Glissez vos fichiers ici</p>
          </div>

          {/* Bouton AJOUTER */}
          <button style={{
            width: '100%', padding: '16px',
            background: 'var(--gradient-flow)', border: 'none', cursor: 'pointer',
            borderRadius: 'var(--r-card)', color: '#fff',
            fontSize: '15px', fontWeight: 800, letterSpacing: '0.08em',
            transition: 'opacity var(--t-fast)',
          }}
            onMouseEnter={e => e.target.style.opacity = '0.9'}
            onMouseLeave={e => e.target.style.opacity = '1'}
          >
            AJOUTER
          </button>
        </div>
      </div>
    </div>
  );
}
