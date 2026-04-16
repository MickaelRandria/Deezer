import { ArrowLeft, Crown, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { GENRE_LABELS } from '../../data/mapData.js';

function fmtStreams(n) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000)    return `${Math.round(n / 1000)}K`;
  return String(n);
}

function TrendIcon({ trend }) {
  if (trend === 'up')   return <TrendingUp  size={13} color="#22c55e" />;
  if (trend === 'down') return <TrendingDown size={13} color="#ef4444" />;
  if (trend === 'new')  return <span style={{ fontSize: '10px', color: '#f59e0b', fontWeight: 700 }}>NEW</span>;
  return <Minus size={13} color="var(--text-tertiary)" />;
}

function ArtistAvatar({ artist, size }) {
  const hue = artist.name.charCodeAt(0) * 47 % 360;
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0, overflow: 'hidden', background: `hsl(${hue},60%,25%)` }}>
      {artist.photo
        ? <img src={artist.photo} alt={artist.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.currentTarget.style.display = 'none'; }} />
        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.38, fontWeight: 800, color: 'rgba(255,255,255,0.5)' }}>{artist.name[0]}</div>
      }
    </div>
  );
}

export default function DeptRankingPage({ dept, onBack, onOpenArtist }) {
  const sorted = [...dept.artists].sort((a, b) => b.streamsMonth - a.streamsMonth);
  const champion = sorted.find(a => a.isChampion) || sorted[0];
  const maxStreams = sorted[0]?.streamsMonth || 1;

  const MONTH = 'avril 2026';

  return (
    <div style={{ height: 'calc(100dvh - 83px - 64px)', overflowY: 'auto', background: 'var(--bg-base)' }}>

      {/* Header sticky */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '14px var(--page-h)',
        background: 'var(--bg-base)', borderBottom: '1px solid var(--border-subtle)',
      }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 0 }}>
          <ArrowLeft size={22} color="var(--text-primary)" />
        </button>
        <div>
          <h1 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>{dept.name}</h1>
          <p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{dept.region}</p>
        </div>
      </div>

      <div style={{ padding: '20px var(--page-h)', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Card Champion du mois */}
        {champion && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
              <Crown size={15} color="#FFD700" fill="#FFD700" />
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#FFD700', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Champion du mois — {MONTH}
              </p>
            </div>
            <div style={{
              borderRadius: 'var(--r-card-lg)', overflow: 'hidden',
              border: '1.5px solid rgba(255,215,0,0.35)',
              background: 'linear-gradient(135deg, rgba(255,215,0,0.06) 0%, var(--bg-card) 100%)',
            }}>
              {/* Photo banner */}
              <div style={{ position: 'relative', height: 100, background: `hsl(${champion.name.charCodeAt(0)*47%360},60%,15%)` }}>
                {champion.photo && (
                  <img src={champion.photo} alt={champion.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', opacity: 0.6 }}
                    onError={e => { e.currentTarget.style.display = 'none'; }} />
                )}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 50%)' }} />
                {champion.monthsChampion >= 3 && (
                  <div style={{ position: 'absolute', top: 10, right: 12, background: 'rgba(255,215,0,0.2)', border: '1px solid rgba(255,215,0,0.5)', borderRadius: 'var(--r-pill)', padding: '3px 10px', fontSize: '11px', color: '#FFD700', fontWeight: 700 }}>
                    👑 {champion.monthsChampion} mois consécutifs
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div>
                    <p style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '2px' }}>{champion.name}</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{GENRE_LABELS[champion.genre] || champion.genre}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>{fmtStreams(champion.streamsMonth)}</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>streams ce mois</p>
                  </div>
                </div>
                {champion.mockId && (
                  <button onClick={() => onOpenArtist(champion.mockId)} style={{
                    width: '100%', padding: '11px',
                    background: 'var(--gradient-flow)', border: 'none',
                    borderRadius: 'var(--r-card)', color: '#fff',
                    fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                  }}>
                    Voir le profil artiste
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Classement */}
        <div>
          <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px' }}>
            Classement {MONTH}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {sorted.map((artist, i) => {
              const barPct = Math.round((artist.streamsMonth / maxStreams) * 100);
              return (
                <div
                  key={artist.name}
                  onClick={artist.mockId ? () => onOpenArtist(artist.mockId) : undefined}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 0',
                    borderBottom: i < sorted.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                    cursor: artist.mockId ? 'pointer' : 'default',
                  }}
                >
                  {/* Rang */}
                  <span style={{ width: 24, fontSize: '13px', fontWeight: 700, color: i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : 'var(--text-tertiary)', textAlign: 'center', flexShrink: 0 }}>
                    {i + 1}
                  </span>

                  {/* Photo */}
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <ArtistAvatar artist={artist} size={44} />
                    {artist.isChampion && (
                      <div style={{ position: 'absolute', top: -4, right: -4, fontSize: '12px', lineHeight: 1 }}>👑</div>
                    )}
                  </div>

                  {/* Nom + barre */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{artist.name}</p>
                      <TrendIcon trend={artist.trend} />
                    </div>
                    {/* Barre de progression */}
                    <div style={{ height: 3, borderRadius: 2, background: 'var(--bg-elevated)', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: 2,
                        width: `${barPct}%`,
                        background: i === 0 ? '#FFD700' : 'var(--accent)',
                        transition: 'width 0.6s ease',
                      }} />
                    </div>
                  </div>

                  {/* Streams */}
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', flexShrink: 0 }}>
                    {fmtStreams(artist.streamsMonth)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
