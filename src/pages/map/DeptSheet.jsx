import { X, MapPin, TrendingUp, TrendingDown, Minus, ChevronRight, Crown } from 'lucide-react';
import { GENRE_LABELS } from '../../data/mapData.js';

const MEDALS = ['🥇', '🥈', '🥉'];

function TrendIcon({ trend }) {
  if (trend === 'up')   return <TrendingUp  size={12} color="#22c55e" />;
  if (trend === 'down') return <TrendingDown size={12} color="#ef4444" />;
  if (trend === 'new')  return <span style={{ fontSize: '10px', color: '#f59e0b', fontWeight: 700 }}>NEW</span>;
  return <Minus size={12} color="var(--text-tertiary)" />;
}

function fmtStreams(n) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000)    return `${Math.round(n / 1000)}K`;
  return String(n);
}

function ArtistAvatar({ artist, size }) {
  const hue = artist.name.charCodeAt(0) * 47 % 360;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0, overflow: 'hidden',
      background: `hsl(${hue},60%,25%)`,
      border: artist.isChampion ? '2px solid #FFD700' : '1.5px solid var(--border-default)',
    }}>
      {artist.photo
        ? <img src={artist.photo} alt={artist.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.currentTarget.style.display = 'none'; }} />
        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.38, fontWeight: 800, color: 'rgba(255,255,255,0.5)' }}>{artist.name[0]}</div>
      }
    </div>
  );
}

export default function DeptSheet({ dept, onClose, onOpenArtist, onViewRanking }) {
  return (
    <div className="glass-sheet hide-scrollbar" style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      borderRadius: '16px 16px 0 0',
      border: '1px solid var(--border-subtle)',
      borderBottom: 'none',
      zIndex: 1000,
      transform: dept ? 'translateY(0)' : 'translateY(100%)',
      transition: 'transform 350ms cubic-bezier(0.4, 0, 0.2, 1)',
      maxHeight: '70%',
      overflowY: 'auto',
    }}>
      {dept && (
        <SheetContent
          dept={dept}
          onClose={onClose}
          onOpenArtist={onOpenArtist}
          onViewRanking={onViewRanking}
        />
      )}
    </div>
  );
}

function SheetContent({ dept, onClose, onOpenArtist, onViewRanking }) {
  const sorted = [...dept.artists].sort((a, b) => b.streamsMonth - a.streamsMonth);
  const champion = sorted.find(a => a.isChampion) || sorted[0];

  return (
    <div style={{ position: 'relative', overflow: 'hidden', minHeight: '100%' }}>
      {/* Blurred immersive background */}
      {champion?.photo && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '220px',
          backgroundImage: `url(${champion.photo})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'blur(30px) saturate(1.5)', opacity: 0.35,
          maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
          pointerEvents: 'none', zIndex: -1
        }} />
      )}

      {/* Handle */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px', position: 'relative' }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border-strong)' }} />
      </div>

      {/* Header dept */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px 14px', position: 'relative' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
            <MapPin size={13} color="var(--accent)" strokeWidth={2.5} />
            <span style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)' }}>
              {dept.name}
            </span>
            <span style={{ fontSize: '13px', color: 'var(--text-tertiary)', fontWeight: 400 }}>({dept.num})</span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', paddingLeft: '19px' }}>{dept.region}</p>
        </div>
        <button
          onClick={onClose}
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <X size={14} color="var(--text-secondary)" />
        </button>
      </div>

      {/* Separator */}
      <div style={{ height: 1, background: 'var(--border-subtle)', margin: '0 16px' }} />

      {/* Body */}
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Champion du mois */}
        {champion && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <Crown size={14} color="#FFD700" fill="#FFD700" />
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#FFD700', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Champion du mois
              </p>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              background: 'linear-gradient(135deg, rgba(255,215,0,0.08), rgba(255,215,0,0.03))',
              border: '1px solid rgba(255,215,0,0.25)', borderRadius: 'var(--r-card-lg)', padding: '12px',
            }}>
              <ArtistAvatar artist={champion} size={56} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>{champion.name}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  {GENRE_LABELS[champion.genre] || champion.genre}
                  {champion.monthsChampion > 0 && ` · ${champion.monthsChampion} mois`}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {fmtStreams(champion.streamsMonth)}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>streams ce mois</span>
                  <TrendIcon trend={champion.trend} />
                </div>
              </div>
              {champion.mockId && (
                <button
                  onClick={() => { onClose(); onOpenArtist(champion.mockId); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
                >
                  <ChevronRight size={18} color="var(--text-tertiary)" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Top artistes */}
        <div>
          <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '10px' }}>
            Top artistes du département
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {sorted.slice(0, 5).map((artist, i) => (
              <div
                key={artist.name}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 0',
                  borderBottom: i < Math.min(sorted.length, 5) - 1 ? '1px solid var(--border-subtle)' : 'none',
                }}
              >
                <span style={{ width: 20, fontSize: '16px', textAlign: 'center', flexShrink: 0 }}>
                  {i < 3 ? MEDALS[i] : <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 600 }}>{i + 1}</span>}
                </span>
                <ArtistAvatar artist={artist} size={38} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{artist.name}</p>
                  <p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{GENRE_LABELS[artist.genre] || artist.genre}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {fmtStreams(artist.streamsMonth)}
                  </span>
                  <TrendIcon trend={artist.trend} />
                </div>
                {artist.mockId && (
                  <button
                    onClick={() => { onClose(); onOpenArtist(artist.mockId); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
                  >
                    <ChevronRight size={14} color="var(--text-tertiary)" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA classement complet */}
        <button
          onClick={onViewRanking}
          style={{
            width: '100%', padding: '14px', marginBottom: '4px',
            background: 'var(--gradient-flow)', border: 'none',
            borderRadius: 'var(--r-card)', color: '#fff',
            fontSize: '14px', fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          }}
        >
          Voir le classement complet <ChevronRight size={16} strokeWidth={2.5} />
        </button>

      </div>
    </div>
  );
}
