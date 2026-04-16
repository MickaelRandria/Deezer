import { Play, Mic, TrendingUp, Globe, Users, Plus, CheckCircle2 } from 'lucide-react';

const TAGS = ['Nocturne', 'Introspectif', 'Électro', 'Soul', 'Cinématique'];

const STATS = [
  { label: 'Auditeurs', value: '12.4K', icon: Users,      delta: '+8%' },
  { label: 'Streams / mois', value: '89K',  icon: TrendingUp, delta: '+14%' },
  { label: 'Pays', value: '23',    icon: Globe,      delta: null },
];

const ACTIVITY = [
  { text: 'ÉCLATS ajouté à 4 playlists éditoriales', time: 'il y a 2h',  dot: '#A238FF' },
  { text: '14 nouveaux followers cette semaine',       time: 'il y a 1j', dot: '#FF5C8A' },
  { text: '"Lueurs (demo)" a passé 5 000 streams',     time: 'il y a 3j', dot: '#4facfe' },
];

const SOCIAL = [
  { label: 'Instagram', handle: '@nayra.wav',   color: '#E1306C' },
  { label: 'TikTok',    handle: '@nayra.wav',   color: '#69C9D0' },
  { label: 'YouTube',   handle: 'Nayra',        color: '#FF0000' },
  { label: 'SoundCloud',handle: 'nayra-music',  color: '#FF5500' },
];

export default function AccueilSection({ onNavigate }) {
  return (
    <div style={{ padding: '32px 40px', display: 'flex', gap: '32px', minHeight: '100%' }}>

      {/* ── Colonne gauche — Carte Profil ─────────────────────── */}
      <div style={{ width: 320, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Profil card */}
        <div style={{
          background: 'var(--bg-card)', borderRadius: 'var(--r-card-lg)',
          border: '1px solid var(--border-subtle)', padding: '24px',
          display: 'flex', flexDirection: 'column', gap: '16px',
        }}>
          {/* Avatar + nom */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #A238FF 0%, #FF5C8A 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '26px', fontWeight: 800, color: '#fff',
            }}>N</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>Nayra</span>
                <CheckCircle2 size={16} color="var(--accent)" strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Artiste · Auteure · Productrice
              </span>
              <br />
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Paris, France</span>
            </div>
          </div>

          {/* Citation */}
          <p style={{
            fontSize: '13px', fontStyle: 'italic', color: 'var(--text-secondary)',
            lineHeight: 1.6, borderLeft: '2px solid var(--accent)', paddingLeft: '12px',
          }}>
            "Je crée pour capturer l'instant avant qu'il ne disparaisse."
          </p>

          {/* Boutons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{
              flex: 1, padding: '9px 0', borderRadius: 'var(--r-pill)',
              background: 'var(--gradient-flow)', border: 'none', cursor: 'pointer',
              color: '#fff', fontSize: '12px', fontWeight: 700,
            }}>
              Explorer l'univers
            </button>
            <button style={{
              flex: 1, padding: '9px 0', borderRadius: 'var(--r-pill)',
              background: 'transparent', border: '1px solid var(--border-default)', cursor: 'pointer',
              color: 'var(--text-primary)', fontSize: '12px', fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
            }}>
              <Mic size={13} strokeWidth={2} />
              Message vocal
            </button>
          </div>

          {/* Tags d'univers */}
          <div>
            <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
              Tags d'univers
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {TAGS.map(tag => (
                <span key={tag} style={{
                  fontSize: '12px', padding: '4px 10px', borderRadius: 'var(--r-pill)',
                  background: 'var(--bg-pressed)', color: 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)',
                }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Réseaux sociaux */}
        <div style={{
          background: 'var(--bg-card)', borderRadius: 'var(--r-card-lg)',
          border: '1px solid var(--border-subtle)', padding: '16px 20px',
        }}>
          <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
            Réseaux
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {SOCIAL.map(({ label, handle, color }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</span>
                <span style={{ fontSize: '12px', color, fontWeight: 500 }}>{handle}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dernier projet */}
        <div style={{
          background: 'var(--bg-card)', borderRadius: 'var(--r-card-lg)',
          border: '1px solid var(--border-subtle)', padding: '14px 16px',
        }}>
          <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
            Dernier projet
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: 52, height: 52, borderRadius: 'var(--r-card)', flexShrink: 0,
              background: 'linear-gradient(135deg, #1a0533, #6b21a8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: '16px', fontWeight: 800, color: '#fff', letterSpacing: '-1px' }}>É</span>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>ÉCLATS</p>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Album · 2024</p>
            </div>
            <button style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--gradient-flow)', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Play size={14} color="#fff" fill="#fff" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Colonne droite — Stats + CTA + Activité ───────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {STATS.map(({ label, value, icon: Icon, delta }) => (
            <div key={label} style={{
              background: 'var(--bg-card)', borderRadius: 'var(--r-card-lg)',
              border: '1px solid var(--border-subtle)', padding: '20px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <Icon size={18} color="var(--accent)" strokeWidth={1.8} />
                {delta && (
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#4ade80', background: 'rgba(74,222,128,0.1)', padding: '2px 7px', borderRadius: 'var(--r-pill)' }}>
                    {delta}
                  </span>
                )}
              </div>
              <p style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>{value}</p>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{label}</p>
            </div>
          ))}
        </div>

        {/* CTA déposer */}
        <button
          onClick={() => onNavigate('upload')}
          style={{
            padding: '18px 24px', borderRadius: 'var(--r-card-lg)',
            background: 'linear-gradient(135deg, rgba(162,56,255,0.15) 0%, rgba(255,92,138,0.10) 100%)',
            border: '1px solid rgba(162,56,255,0.35)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '14px', textAlign: 'left',
          }}
        >
          <div style={{
            width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
            background: 'var(--gradient-flow)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Plus size={20} color="#fff" strokeWidth={2.5} />
          </div>
          <div>
            <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>
              Déposer un nouveau titre
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Partage ta musique avec tes auditeurs
            </p>
          </div>
        </button>

        {/* Dernière activité */}
        <div style={{
          background: 'var(--bg-card)', borderRadius: 'var(--r-card-lg)',
          border: '1px solid var(--border-subtle)', padding: '20px',
          flex: 1,
        }}>
          <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
            Dernière activité
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {ACTIVITY.map(({ text, time, dot }, i) => (
              <div key={i} style={{ display: 'flex', gap: '14px', paddingBottom: i < ACTIVITY.length - 1 ? '16px' : 0 }}>
                {/* Timeline dot + line */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: dot, marginTop: '3px' }} />
                  {i < ACTIVITY.length - 1 && (
                    <div style={{ width: 1, flex: 1, background: 'var(--border-subtle)', margin: '4px 0' }} />
                  )}
                </div>
                <div style={{ flex: 1, paddingBottom: i < ACTIVITY.length - 1 ? '4px' : 0 }}>
                  <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.5 }}>{text}</p>
                  <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>{time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
