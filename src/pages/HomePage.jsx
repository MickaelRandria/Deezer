import { useState, useEffect } from 'react';
import { Bell, Smile, ChevronRight } from 'lucide-react';
import { getArtist, getArtistTopTracks, normalizeTrack } from '../api/deezer.js';

const FAVORITE_ARTISTS_IDS = [152058642, 15337813, 323311, 13152245]; // Aupinard, Green Montana, RK, Zamdane
const MIX_COLS = [
  [274705721, 121672292, 337973], // KLN, Werenoi, Bouss
  [13790723, 256080, 230],     // L2B, Rim'K, Kanye West
];

const POUR_TOI_DATA = [
  { title: 'DAILY', artists: [604107, 13790723, 123555852, 274705721], label: 'Avec SDM, L2B, menace Santana, KLN', bgColor: '#f0d9ff' },
  { title: 'DAILY', artists: [390, 323311, 4087782, 6545727], label: 'Avec Booba, RK, Lacrim, Hornet La Frappe', bgColor: '#ffe3f2' },
];

export default function HomePage({ onOpenArtist, onOpenPlayer, onEnterCreatorMode }) {
  const [favoriteArtists, setFavoriteArtists] = useState([]);
  const [mixCards, setMixCards] = useState([]);
  const [pourToiPhotos, setPourToiPhotos] = useState({});

  useEffect(() => {
    // 1. Fetch favorite artists
    Promise.all(FAVORITE_ARTISTS_IDS.map(id => getArtist(id).catch(() => null)))
      .then(results => setFavoriteArtists(results.filter(Boolean)));

    // 2. Fetch tracks for multiple mix cards
    Promise.all(MIX_COLS.map(col => 
      Promise.all(col.map(id => getArtistTopTracks(id, 1).catch(() => [])))
    )).then(results => {
      const cards = results.map(colResults => 
        colResults.map(t => t[0] ? normalizeTrack(t[0]) : null).filter(Boolean)
      );
      setMixCards(cards);
    });

    // 3. Fetch artist photos for Pour Toi
    const allPourToiArtists = [...new Set(POUR_TOI_DATA.flatMap(d => d.artists))];
    Promise.all(allPourToiArtists.map(id => getArtist(id).catch(() => null)))
      .then(results => {
        const photoMap = {};
        results.filter(Boolean).forEach(a => photoMap[a.id] = a.picture_medium);
        setPourToiPhotos(photoMap);
      });
  }, []);

  return (
    <div style={{ paddingBottom: '140px', background: 'var(--bg-base)' }}>

      {/* ── Header ──────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px var(--page-h) 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>W</div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>Accueil</h1>
        </div>
        <Bell size={26} color="#fff" strokeWidth={1.5} />
      </div>

      {/* ── Tes artistes préféré·es ─────────────────────────── */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', padding: '0 var(--page-h)', marginBottom: '18px' }}>Tes artistes préféré·es</h2>
        <div className="hide-scrollbar" style={{ display: 'flex', gap: '20px', padding: '0 var(--page-h)', overflowX: 'auto' }}>
          {favoriteArtists.map(artist => (
            <button key={artist.id} onClick={() => onOpenArtist(artist.id)} style={{ flexShrink: 0, width: 110, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <div style={{ width: 110, height: 110, borderRadius: '50%', overflow: 'hidden', background: '#222' }}>
                <img src={artist.picture_big} alt={artist.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#fff', textAlign: 'center' }}>{artist.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Mixes inspirés par ───────────────────────────────── */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ padding: '0 var(--page-h)', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>Mixes inspirés par</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Découvre de nouveaux titres similaires à tes favoris</p>
        </div>
        <div className="hide-scrollbar" style={{ display: 'flex', gap: '12px', paddingLeft: 'var(--page-h)', overflowX: 'auto', scrollSnapType: 'x mandatory' }}>
          {mixCards.map((tracks, idx) => (
            <div key={idx} style={{ flexShrink: 0, width: 'cacl(100vw - 32px)', width: '340px', background: 'var(--bg-elevated)', borderRadius: '12px', padding: '4px', scrollSnapAlign: 'start' }}>
              {tracks.map(t => (
                <button key={t.id} onClick={onOpenPlayer} style={{ display: 'flex', alignItems: 'center', gap: '14px', width: '100%', padding: '10px 12px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                  <img src={t.cover} alt="" style={{ width: 56, height: 56, borderRadius: '4px', objectFit: 'cover', background: '#333' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '16px', fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.title} {t.explicit && <span style={{ fontSize: '9px', border: '0.5px solid rgba(255,255,255,0.4)', borderRadius: '1px', padding: '0 2px', marginLeft: '4px', verticalAlign: 'middle' }}>E</span>}
                    </p>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{t.artistName}</p>
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Flow ───────────────────────────────────────────── */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', padding: '0 var(--page-h)', marginBottom: '20px' }}>Flow, la bande-son de tes émotions</h2>
        <div className="hide-scrollbar" style={{ display: 'flex', gap: '16px', padding: '0 var(--page-h)', overflowX: 'auto', alignItems: 'flex-start' }}>
          {[
            { id: 'flow', label: 'Flow', content: <span style={{ fontSize: '22px', fontWeight: 900, color: '#fff' }}>Flow</span>, bg: 'linear-gradient(135deg, #A238FF 0%, #FF5C8A 100%)' },
            { id: 'vibes', label: 'Good vibes', content: <Smile size={32} color="#f2f04e" />, bg: 'var(--bg-elevated)' },
            { id: 'motivation', label: 'Motivation', content: <div style={{ fontSize: '30px' }}>👟</div>, bg: 'var(--bg-elevated)' },
            { id: 'soiree', label: 'Soirée', content: <div style={{ fontSize: '30px' }}>🎉</div>, bg: 'var(--bg-elevated)' },
          ].map(item => (
            <div key={item.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              <button onClick={onOpenPlayer} style={{ width: 100, height: 100, borderRadius: '50%', background: item.bg, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                {item.content}
              </button>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Pour toi ───────────────────────────────────────── */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', padding: '0 var(--page-h)', marginBottom: '18px' }}>Pour toi</h2>
        <div className="hide-scrollbar" style={{ display: 'flex', gap: '14px', paddingLeft: 'var(--page-h)', overflowX: 'auto', scrollSnapType: 'x mandatory' }}>
          {POUR_TOI_DATA.map((item, i) => (
            <div key={i} style={{ flexShrink: 0, width: '220px', scrollSnapAlign: 'start' }}>
              <div style={{ width: '100%', height: '220px', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, background: item.bgColor, padding: '12px', position: 'relative' }}>
                   <span style={{ fontSize: '24px', fontWeight: 900, color: '#000', letterSpacing: '1px' }}>{item.title}</span>
                </div>
                <div style={{ flex: 1.2, display: 'flex', gap: '1px' }}>
                  <div style={{ flex: 1, background: '#111' }}>
                    <img src={pourToiPhotos[item.artists[0]]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1, background: '#111' }}>
                    <img src={pourToiPhotos[item.artists[1]]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '13px', color: '#fff', fontWeight: 500, marginTop: '10px', lineHeight: '1.4' }}>{item.label}</p>
            </div>
          ))}
          {/* Third block mock */}
          <div style={{ flexShrink: 0, width: '220px', opacity: 0.5 }}>
             <div style={{ width: '100%', height: '220px', borderRadius: '12px', background: 'var(--bg-elevated)' }} />
          </div>
        </div>
      </div>

      {/* ── Passer en mode Créateur ─────────────────────────── */}
      <div style={{ padding: '0 var(--page-h) 8px' }}>
        <button
          onClick={onEnterCreatorMode}
          style={{
            width: '100%', padding: '16px',
            background: 'var(--gradient-flow)',
            border: 'none', borderRadius: 'var(--r-card-lg)',
            color: '#fff', fontSize: '15px', fontWeight: 700,
            cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '8px',
            fontVariationSettings: "'wdth' 75",
          }}
        >
          <span style={{ fontSize: '18px' }}>🎙</span>
          Passer en mode Créateur
          <ChevronRight size={18} strokeWidth={2.5} />
        </button>
      </div>

    </div>
  );
}
