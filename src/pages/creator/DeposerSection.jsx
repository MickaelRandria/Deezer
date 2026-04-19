import { useState, useEffect } from 'react';
import { currentTrack } from '../../data/mockData.js';
import { searchTracks } from '../../api/deezer.js';
import {
  X, Music2, Mic, ListMusic, ChevronDown, Calendar,
  Check, MoreHorizontal, CloudUpload, ChevronRight,
  Sparkles, Loader, ShieldCheck, Disc3, Video,
} from 'lucide-react';
import { MOOD_ICONS } from '../../components/DeezerIcons.jsx';

const CONTENT_TYPES = [
  { id: 'single',   label: 'Single',   icon: Disc3 },
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
  "\"un thé?\" est né d'une session acoustique un dimanche soir à Bordeaux. L'idée était de capturer ce moment suspendu entre deux personnes — la conversation qui n'a pas besoin d'être importante pour être vraie. Une guitare bossa nova, quelques cordes discrètes, et cette voix posée comme une confidence.";

const AI_INSPIRATIONS_TEXT =
  "João Gilberto pour la pureté et l'économie de la guitare acoustique, Daniel Caesar pour la chaleur vocale et l'intimité des arrangements, Ichon pour la poésie du quotidien mise en musique.";

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

/* ── Backstage photo thumbnails ───────────────────────── */
const BACKSTAGE_THUMBS = [
  'https://cdn-images.dzcdn.net/images/cover/4ac90491c0ae1956af7c470b7a4871dd/250x250-000000-80-0-0.jpg',
  'https://cdn-images.dzcdn.net/images/cover/ec715a0a0c364cbe43b9460979f0acee/250x250-000000-80-0-0.jpg',
  'https://cdn-images.dzcdn.net/images/cover/c47189ac043fc60aa7d40f5072179fb7/250x250-000000-80-0-0.jpg',
  'https://cdn-images.dzcdn.net/images/artist/b17c24f603a11da0c5c4dafb2fbb4778/250x250-000000-80-0-0.jpg',
];

/* ── Mini upload zone ─────────────────────────────────── */
function UploadMiniZone({ icon, label, hint, type }) {
  const [phase, setPhase] = useState('idle'); // idle | loading | done
  const [progress, setProgress] = useState(0);

  function simulate() {
    if (phase !== 'idle') return;
    setPhase('loading');
    setProgress(0);
    const duration = type === 'backstage' ? 2200 : 1600;
    const start = Date.now();
    function tick() {
      const p = Math.min(100, ((Date.now() - start) / duration) * 100);
      setProgress(Math.round(p));
      if (p < 100) requestAnimationFrame(tick);
      else setPhase('done');
    }
    requestAnimationFrame(tick);
  }

  /* ── DONE: voice note ── */
  if (phase === 'done' && type === 'voice') {
    return (
      <div style={{
        borderRadius: 'var(--r-card)',
        border: '1.5px solid rgba(74,222,128,0.4)',
        background: 'rgba(74,222,128,0.07)',
        padding: '12px 14px',
        display: 'flex', flexDirection: 'column', gap: '8px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
            background: 'rgba(74,222,128,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Mic size={16} color="#4ade80" strokeWidth={2} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#4ade80' }}>Note vocale ajoutée</p>
            <p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>un_thé_voix.mp3 · 0:08</p>
          </div>
          <span style={{ fontSize: '11px', color: '#4ade80', fontWeight: 700 }}>✓</span>
        </div>
        {/* Waveform bars */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', height: 24, paddingLeft: '44px' }}>
          {[4,8,14,6,18,10,5,16,8,12,7,20,9,5,14,11,6,17,8,4].map((h, i) => (
            <div key={i} style={{
              width: 3, height: h, borderRadius: 2,
              background: 'rgba(74,222,128,0.6)',
              flexShrink: 0,
            }} />
          ))}
        </div>
      </div>
    );
  }

  /* ── DONE: backstage ── */
  if (phase === 'done' && type === 'backstage') {
    return (
      <div style={{
        borderRadius: 'var(--r-card)',
        border: '1.5px solid rgba(74,222,128,0.4)',
        background: 'rgba(74,222,128,0.07)',
        padding: '12px 14px',
        display: 'flex', flexDirection: 'column', gap: '10px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#4ade80' }}>✓</span>
          <p style={{ fontSize: '13px', fontWeight: 700, color: '#4ade80', flex: 1 }}>4 photos backstage ajoutées</p>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {BACKSTAGE_THUMBS.map((src, i) => (
            <div key={i} style={{
              width: 56, height: 56, borderRadius: 6, overflow: 'hidden', flexShrink: 0,
              background: '#1a1a2e',
            }}>
              <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ── LOADING ── */
  if (phase === 'loading') {
    return (
      <div style={{
        borderRadius: 'var(--r-card)',
        border: '1.5px dashed var(--accent)',
        background: 'var(--accent-alpha)',
        padding: '12px 14px',
        display: 'flex', flexDirection: 'column', gap: '8px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {icon}
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent)' }}>
              {type === 'backstage' ? 'Import en cours…' : 'Chargement…'} {progress}%
            </p>
          </div>
          <Loader size={14} color="var(--accent)" style={{ animation: 'spin 0.8s linear infinite' }} />
        </div>
        {/* Progress bar */}
        <div style={{ height: 3, borderRadius: 2, background: 'var(--border-default)', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 2,
            background: 'var(--gradient-flow)',
            width: `${progress}%`,
            transition: 'width 80ms linear',
          }} />
        </div>
      </div>
    );
  }

  /* ── IDLE ── */
  return (
    <div
      onClick={simulate}
      style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '12px 14px', borderRadius: 'var(--r-card)',
        border: '1.5px dashed var(--border-default)',
        background: 'var(--bg-elevated)',
        cursor: 'pointer', transition: 'all var(--t-fast)',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-alpha)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.background = 'var(--bg-elevated)'; }}
    >
      {icon}
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '1px' }}>{label}</p>
        <p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{hint}</p>
      </div>
      <CloudUpload size={16} color="var(--text-tertiary)" />
    </div>
  );
}

/* ── Publish overlay ──────────────────────────────────── */
function PublishOverlay({ onDone }) {
  const [phase, setPhase] = useState('sending'); // sending | success
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const duration = 1800;
    function tick() {
      const p = Math.min(100, ((Date.now() - start) / duration) * 100);
      setProgress(Math.round(p));
      if (p < 100) requestAnimationFrame(tick);
      else setPhase('success');
    }
    requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (phase === 'success') {
      const t = setTimeout(onDone, 2000);
      return () => clearTimeout(t);
    }
  }, [phase, onDone]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 500,
      background: 'rgba(0,0,0,0.88)',
      backdropFilter: 'blur(20px)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: '24px',
    }}>
      {phase === 'sending' ? (
        <>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'var(--accent-alpha)',
            border: '2px solid var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Loader size={30} color="var(--accent)" style={{ animation: 'spin 0.8s linear infinite' }} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '18px', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>Publication en cours…</p>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>un thé? · spleen. social club</p>
          </div>
          <div style={{ width: 260, height: 4, borderRadius: 2, background: 'var(--border-default)' }}>
            <div style={{
              height: '100%', borderRadius: 2,
              background: 'var(--gradient-flow)',
              width: `${progress}%`,
              transition: 'width 80ms linear',
            }} />
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{progress}%</p>
        </>
      ) : (
        <>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'rgba(74,222,128,0.15)',
            border: '2px solid #4ade80',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '28px', marginBottom: '6px', lineHeight: 1 }}>🎶 🪐 ✅</p>
            <p style={{ fontSize: '22px', fontWeight: 900, color: '#fff', marginBottom: '6px', letterSpacing: '-0.4px' }}>
              Single publié !
            </p>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              🎙️ <strong style={{ color: '#fff' }}>un thé?</strong> est maintenant disponible
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
              🌍 Distribution mondiale · 🎧 Prêt à l'écoute
            </p>
          </div>
        </>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────
export default function DeposerSection({ onClose, onPublished }) {
  const [contentType, setContentType] = useState('single');
  const [trackCover, setTrackCover]   = useState('');
  const [albumName, setAlbumName]     = useState(currentTrack.title);
  const [country]                      = useState('France');
  const [date]                         = useState(`${currentTrack.year}`);
  const [notes, setNotes]             = useState('');
  const [moods, setMoods]             = useState(['chill', 'goodVibes']);
  const [inspirations, setInspirations] = useState('');
  const [dragOver, setDragOver]       = useState(false);

  useEffect(() => {
    searchTracks('un thé aupinard', 5)
      .then(tracks => {
        const t = tracks.find(t => t.artist?.name?.toLowerCase().includes('aupinard')) || tracks[0];
        if (t?.album?.cover_medium) setTrackCover(t.album.cover_medium);
      })
      .catch(() => {});
  }, []);

  const [notesAiLoading, setNotesAiLoading]         = useState(false);
  const [inspirationsAiLoading, setInspirationsAiLoading] = useState(false);
  const [humanCertified, setHumanCertified]         = useState(false);
  const [publishing, setPublishing]                 = useState(false);

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

  const titlesCount = 1;
  const releaseDate = `2026`;
  const duration    = '2 min 53';

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
            {CONTENT_TYPES.map((ct) => {
              const active = contentType === ct.id;
              const CTIcon = ct.icon;
              return (
                <button
                  key={ct.id}
                  onClick={() => setContentType(ct.id)}
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
                  <CTIcon size={15} strokeWidth={active ? 2.5 : 1.8} />
                  {ct.label}
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
                background: 'linear-gradient(135deg, #1a1a3e, #6b21a8)',
                overflow: 'hidden',
              }}>
                {trackCover && <img src={trackCover} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{currentTrack.title}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{currentTrack.album}</p>
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

          {/* Note vocale */}
          <UploadMiniZone
            icon={<Mic size={18} color="var(--text-tertiary)" strokeWidth={1.5} />}
            label="Note vocale"
            hint="MP3 ou WAV · max 5 min"
            type="voice"
          />

          {/* Backstage */}
          <UploadMiniZone
            icon={<Video size={18} color="var(--text-tertiary)" strokeWidth={1.5} />}
            label="Contenu backstage"
            hint="Photo ou vidéo · max 500 Mo"
            type="backstage"
          />

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
            onClick={() => { if (humanCertified) setPublishing(true); }}
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

          {publishing && <PublishOverlay onDone={onPublished || onClose} />}
        </div>
      </div>
    </div>
  );
}
