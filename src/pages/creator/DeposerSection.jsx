import { useState } from 'react';
import {
  X, Music2, Mic, ListMusic, ChevronDown, Calendar,
  Check, MoreHorizontal, CloudUpload, ChevronRight,
  Sparkles, Loader, ShieldCheck,
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

const AI_NOTES_TEXT =
  "Ce morceau est né d'une session acoustique tardive. L'idée était de capturer l'essence d'une nuit d'été à Bordeaux, en mélangeant une guitare bossa nova avec des rythmiques R&B modernes.";

const AI_INSPIRATIONS_TEXT =
  "João Gilberto pour la pureté de la guitare acoustique, Daniel Caesar pour la chaleur vocale, et les nuits de La Plage du Lac comme toile de fond émotionnelle.";

// ── Helpers ──────────────────────────────────────────────

function Label({ children, hint, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
      <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', flex: 1 }}>
        {children}
      </span>
      {hint && (
        <span style={{
          width: 16, height: 16, borderRadius: '50%',
          background: 'var(--bg-pressed)', border: '1px solid var(--border-default)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '10px', color: 'var(--text-tertiary)', cursor: 'help',
        }}>?</span>
      )}
      {action}
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
        transition: 'border-color 150ms ease, box-shadow 150ms ease',
        boxSizing: 'border-box',
      }}
      onFocus={e => {
        e.target.style.borderColor = 'var(--accent)';
        e.target.style.boxShadow = '0 0 0 3px rgba(162,56,255,0.15)';
      }}
      onBlur={e => {
        e.target.style.borderColor = 'var(--border-subtle)';
        e.target.style.boxShadow = 'none';
      }}
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
        transition: 'border-color 150ms ease, box-shadow 150ms ease',
        boxSizing: 'border-box',
      }}
      onFocus={e => {
        e.target.style.borderColor = 'var(--accent)';
        e.target.style.boxShadow = '0 0 0 3px rgba(162,56,255,0.15)';
      }}
      onBlur={e => {
        e.target.style.borderColor = 'var(--border-subtle)';
        e.target.style.boxShadow = 'none';
      }}
    />
  );
}

/* ── AI Button ─────────────────────────────────────────── */
function AIButton({ loading, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        padding: '5px 12px', borderRadius: 'var(--r-pill)',
        background: 'linear-gradient(135deg, rgba(162,56,255,0.12) 0%, rgba(255,92,138,0.10) 100%)',
        border: '1px solid rgba(162,56,255,0.45)',
        cursor: loading ? 'default' : 'pointer',
        transition: 'all 150ms ease',
        boxShadow: '0 0 10px rgba(162,56,255,0.18)',
        flexShrink: 0,
      }}
      onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = '0 0 16px rgba(162,56,255,0.38)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 10px rgba(162,56,255,0.18)'; }}
    >
      {loading
        ? <Loader size={12} color="var(--accent)"
            style={{ animation: 'spin 0.8s linear infinite' }} />
        : <Sparkles size={12} color="var(--accent)" />
      }
      <span style={{
        fontSize: '12px', fontWeight: 600,
        background: 'var(--gradient-flow)', WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        whiteSpace: 'nowrap',
      }}>
        {loading ? 'Génération…' : 'Générer avec l\'IA'}
      </span>
    </button>
  );
}

/* ── Spinner keyframe ── */
const spinStyle = document.createElement('style');
spinStyle.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(spinStyle);

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

  const [notesAiLoading, setNotesAiLoading]         = useState(false);
  const [inspirationsAiLoading, setInspirationsAiLoading] = useState(false);
  const [humanCertified, setHumanCertified]         = useState(false);

  function toggleMood(id) {
    setMoods(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  }

  function handleNotesAI() {
    setNotesAiLoading(true);
    setTimeout(() => {
      setNotes(AI_NOTES_TEXT);
      setMoods(prev => {
        const next = [...prev];
        if (!next.includes('chill'))     next.push('chill');
        if (!next.includes('goodVibes')) next.push('goodVibes');
        return next;
      });
      setNotesAiLoading(false);
    }, 1500);
  }

  function handleInspirationsAI() {
    setInspirationsAiLoading(true);
    setTimeout(() => {
      setInspirations(AI_INSPIRATIONS_TEXT);
      setInspirationsAiLoading(false);
    }, 1500);
  }

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

          {/* Notes — with AI button */}
          <div>
            <Label action={
              <AIButton loading={notesAiLoading} onClick={handleNotesAI} />
            }>
              Notes sur la création
            </Label>
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

          {/* Inspirations — with AI button */}
          <div>
            <Label action={
              <AIButton loading={inspirationsAiLoading} onClick={handleInspirationsAI} />
            }>
              Inspirations / Références
            </Label>
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

          {/* ── Human Certification toggle ── */}
          <div
            onClick={() => setHumanCertified(v => !v)}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: '12px',
              padding: '14px 16px',
              borderRadius: 'var(--r-card-lg)',
              border: `1px solid ${humanCertified ? 'var(--accent)' : 'var(--border-default)'}`,
              background: humanCertified ? 'rgba(162,56,255,0.07)' : 'var(--bg-elevated)',
              cursor: 'pointer',
              transition: 'border-color 200ms ease, background 200ms ease',
              boxShadow: humanCertified ? '0 0 14px rgba(162,56,255,0.18)' : 'none',
            }}
          >
            {/* Toggle track */}
            <div style={{
              position: 'relative', width: 40, height: 22, flexShrink: 0,
              borderRadius: 11,
              background: humanCertified ? 'var(--accent)' : 'var(--bg-pressed)',
              border: `1px solid ${humanCertified ? 'var(--accent)' : 'var(--border-default)'}`,
              transition: 'background 200ms ease',
              marginTop: '2px',
            }}>
              <div style={{
                position: 'absolute', top: 2,
                left: humanCertified ? 18 : 2,
                width: 16, height: 16, borderRadius: '50%',
                background: '#fff',
                transition: 'left 200ms cubic-bezier(0.34,1.56,0.64,1)',
                boxShadow: '0 1px 4px rgba(0,0,0,0.35)',
              }} />
            </div>

            {/* Label */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                <ShieldCheck size={14} color={humanCertified ? 'var(--accent)' : 'var(--text-secondary)'} strokeWidth={2} />
                <span style={{
                  fontSize: '13px', fontWeight: 700,
                  color: humanCertified ? 'var(--accent)' : 'var(--text-primary)',
                }}>
                  Certifier comme Création 100% Humaine
                </span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', lineHeight: 1.4 }}>
                Active le Badge Pulse "Vérifié Humain" visible par les auditeurs.
              </p>
            </div>
          </div>

          {/* Bouton AJOUTER */}
          <button
            disabled={!humanCertified}
            style={{
              width: '100%', padding: '16px',
              background: humanCertified ? 'var(--gradient-flow)' : 'var(--bg-pressed)',
              border: 'none', cursor: humanCertified ? 'pointer' : 'not-allowed',
              borderRadius: 'var(--r-card)', color: humanCertified ? '#fff' : 'var(--text-tertiary)',
              fontSize: '15px', fontWeight: 800, letterSpacing: '0.08em',
              transition: 'opacity var(--t-fast), background 200ms ease',
            }}
            onMouseEnter={e => { if (humanCertified) e.currentTarget.style.opacity = '0.88'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
          >
            AJOUTER
          </button>
        </div>
      </div>
    </div>
  );
}
