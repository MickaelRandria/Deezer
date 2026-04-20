import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronDown, Heart, LocateFixed, Zap, Music2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, GeoJSON, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { mapEvents, CITY_ARTISTS } from '../data/mapData.js';
import { searchArtist, searchArtistsByGenre } from '../api/deezer.js';

// Major French cities — used to place API-fetched artists on the map (Deezer has no geo data)
const FRENCH_CITY_COORDS = [
  { lat: 48.86,  lng: 2.35,   city: 'Paris' },
  { lat: 43.30,  lng: 5.37,   city: 'Marseille' },
  { lat: 45.75,  lng: 4.83,   city: 'Lyon' },
  { lat: 43.60,  lng: 1.44,   city: 'Toulouse' },
  { lat: 44.84,  lng: -0.58,  city: 'Bordeaux' },
  { lat: 47.22,  lng: -1.55,  city: 'Nantes' },
  { lat: 50.63,  lng: 3.06,   city: 'Lille' },
  { lat: 48.58,  lng: 7.75,   city: 'Strasbourg' },
  { lat: 43.70,  lng: 7.26,   city: 'Nice' },
  { lat: 49.44,  lng: 1.10,   city: 'Rouen' },
];

// Per-genre Deezer search queries
const GENRE_QUERIES = {
  rap:        'rap français',
  rnb:        'r&b soul français',
  pop:        'pop france',
  electronic: 'electro musique france',
  jazz:       'jazz france',
  indie:      'indie rock france',
  rock:       'rock france',
};

const BORDEAUX = { lat: 44.84, lng: -0.58 };
const FRANCE_BOUNDS = [[41.0, -6.0], [51.5, 10.5]];
const CLUSTER_ZOOM_THRESHOLD = 7;

const GENRE_OPTIONS = [
  { id: 'all',        label: 'Tous' },
  { id: 'rap',        label: 'Rap' },
  { id: 'rnb',        label: 'R&B' },
  { id: 'electronic', label: 'Électro' },
  { id: 'pop',        label: 'Pop' },
  { id: 'jazz',       label: 'Jazz' },
  { id: 'indie',      label: 'Indie' },
];

// Genre brand colors — used for cluster badges, map markers and filter pills
const GENRE_COLORS = {
  rap:        '#E4F615',  // Neon Yellow-Green
  pop:        '#FF0092',  // Vivid Pink/Magenta
  rock:       '#00D1FF',  // Electric Blue
  rnb:        '#A238FF',  // Purple (Deezer accent)
  electronic: '#7B61FF',  // Indigo
  jazz:       '#FF9500',  // Warm Orange
  indie:      '#00D1FF',  // Electric Blue
};

// Text color to use on top of a genre bubble (dark for bright colors)
const GENRE_TEXT = {
  rap:        '#000',
  pop:        '#fff',
  rock:       '#000',
  rnb:        '#fff',
  electronic: '#fff',
  jazz:       '#000',
  indie:      '#000',
};

// ── Subtle uniform style for GeoJSON department outlines ─────────────────────
function deptStyle() {
  return { fillColor: '#1e1e30', fillOpacity: 0.45, color: '#33335a', weight: 0.9, opacity: 0.65 };
}

// Small coordinate offsets so artists from the same city don't stack perfectly
const CITY_SPREAD = [
  [ 0.000,  0.000],
  [ 0.018,  0.028],
  [-0.022,  0.020],
  [ 0.028, -0.016],
  [-0.018, -0.026],
  [ 0.010,  0.042],
  [-0.038,  0.010],
];

/** Returns a copy of each artist with a small positional offset within its city. */
function spreadArtists(artists) {
  const cityIdx = {};
  return artists.map(a => {
    if (!cityIdx[a.city]) cityIdx[a.city] = 0;
    const i = cityIdx[a.city]++;
    const [dlat, dlng] = CITY_SPREAD[i % CITY_SPREAD.length];
    return { ...a, lat: a.lat + dlat, lng: a.lng + dlng };
  });
}

// ── Clustering helpers ────────────────────────────────────────────────────────
/** Groups artists by city and computes topGenre (dominant by count) per cluster. */
function getCityClusters(artists, genreFilter) {
  const cities = {};
  artists.forEach(a => {
    if (genreFilter !== 'all' && a.genre !== genreFilter) return;
    if (!cities[a.city]) {
      cities[a.city] = { name: a.city, lat: a.lat, lng: a.lng, count: 0, genreCount: {} };
    }
    cities[a.city].count += 1;
    cities[a.city].genreCount[a.genre] = (cities[a.city].genreCount[a.genre] || 0) + 1;
  });
  return Object.values(cities).map(c => ({
    ...c,
    topGenre: Object.entries(c.genreCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'rap',
  }));
}

function makeClusterIcon(count, hexColor = '#A238FF', textColor = '#fff') {
  const sz = count > 9 ? 62 : 54;
  // Outer glow ring uses hex + 20% alpha (hex "33")
  return L.divIcon({
    className: '',
    html: `<div style="width:${sz}px;height:${sz}px;border-radius:50%;background:${hexColor};border:2px solid ${hexColor};box-shadow:0 0 0 8px ${hexColor}33,0 4px 20px rgba(0,0,0,0.55);display:flex;align-items:center;justify-content:center;flex-direction:column;cursor:pointer;"><span style="font-size:${count > 9 ? 18 : 22}px;font-weight:900;color:${textColor};line-height:1;">${count}</span><span style="font-size:8px;color:${textColor === '#000' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)'};font-weight:600;margin-top:1px;">artistes</span></div>`,
    iconSize: [sz, sz],
    iconAnchor: [sz / 2, sz / 2],
  });
}

// ── Venue image fallbacks (images libres de salles fréquentes) ──────────────────
const VENUE_IMAGES = {
  'Rock School Barbey':  'https://images.unsplash.com/photo-1501386761578-eaa54b2ff533?w=160&h=160&fit=crop&q=70',
  'Le Krakatoa':         'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=160&h=160&fit=crop&q=70',
  'Darwin Ecosystème':   'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=160&h=160&fit=crop&q=70',
  'Café de la Danse':    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=160&h=160&fit=crop&q=70',
  'Transbordeur':        'https://images.unsplash.com/photo-1563841930606-67e2bce48b78?w=160&h=160&fit=crop&q=70',
  'Espace Julien':       'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=160&h=160&fit=crop&q=70',
  'Le Ferrailleur':      'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=160&h=160&fit=crop&q=70',
  "L'Aéronef":           'https://images.unsplash.com/photo-1508854710579-5cecc3a9ff17?w=160&h=160&fit=crop&q=70',
  'La Cigale':           'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=160&h=160&fit=crop&q=70',
  "L'Ampère":            'https://images.unsplash.com/photo-1594623274890-6b45ce7cf44a?w=160&h=160&fit=crop&q=70',
  'Le Rocher de Palmer': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=160&h=160&fit=crop&q=70',
};

// ── Marker icon builders ──────────────────────────────────────────────────────
// Design commun : cercle photo + queue triangulaire vers le bas
function makePinHtml({ imgSrc, fallbackColor, initial, isSelected, badge, size = 48 }) {
  const ring   = isSelected ? `border:3px solid #C060FF;box-shadow:0 0 0 3px rgba(162,56,255,0.4),0 4px 16px rgba(0,0,0,0.7);` : `border:2.5px solid #A238FF;box-shadow:0 0 8px rgba(162,56,255,0.5),0 3px 10px rgba(0,0,0,0.6);`;
  const tail   = isSelected ? '#C060FF' : '#A238FF';
  const hue    = (initial?.charCodeAt(0) || 200) * 47 % 360;
  const inner  = imgSrc
    ? `<img src="${imgSrc}" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none'" />`
    : `<div style="width:100%;height:100%;background:linear-gradient(135deg,hsl(${hue},55%,25%),hsl(${(hue+60)%360},65%,40%));display:flex;align-items:center;justify-content:center;font-size:${Math.round(size*0.38)}px;font-weight:800;color:rgba(255,255,255,0.9)">${initial || '?'}</div>`;
  return `<div style="display:flex;flex-direction:column;align-items:center;cursor:pointer">
    <div style="width:${size}px;height:${size}px;border-radius:50%;overflow:hidden;${ring}background:#111;">${inner}</div>
    <div style="width:0;height:0;border-left:${size/4}px solid transparent;border-right:${size/4}px solid transparent;border-top:${size/3}px solid ${tail};margin-top:-1px;"></div>
    ${badge ? `<div style="background:#ff7733;color:#fff;font-size:10px;font-weight:800;padding:2px 8px;border-radius:4px;margin-top:2px;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.5)">${badge}</div>` : ''}
  </div>`;
}

function getEventIcon(evt, isSelected, photo) {
  const [, m, d] = (evt.date || '').split('-');
  const dateStr  = m && d ? `${d}/${m}` : '—';
  // Priority: venue image > event cover > artist photo
  const imgSrc   = VENUE_IMAGES[evt.venue?.name] || evt.image || photo || '';
  const initial  = (evt.artists?.[0]?.name || evt.name || 'E')[0].toUpperCase();
  return L.divIcon({
    className: '',
    html: makePinHtml({ imgSrc, initial, isSelected, badge: dateStr }),
    iconSize: [48, 80],
    iconAnchor: [24, 64],
  });
}

function getArtistIcon(artist, isSelected) {
  const name   = artist.name || '?';
  const label  = name.length > 9 ? name.slice(0, 8) + '…' : name;
  const html   = makePinHtml({ imgSrc: artist.photo, initial: name[0], isSelected, size: 44 }) +
    `<div style="font-size:9px;font-weight:700;color:#fff;background:rgba(0,0,0,0.7);padding:1px 6px;border-radius:3px;margin-top:3px;white-space:nowrap;backdrop-filter:blur(4px)">${label}</div>`;
  return L.divIcon({
    className: '',
    html: `<div style="display:flex;flex-direction:column;align-items:center;cursor:pointer">${html}</div>`,
    iconSize: [44, 80],
    iconAnchor: [22, 60],
  });
}

// ── Map sub-components ────────────────────────────────────────────────────────
function MapController({ recenterSignal }) {
  const map = useMap();
  const prev = useRef(recenterSignal);
  useEffect(() => {
    if (recenterSignal !== prev.current) {
      prev.current = recenterSignal;
      map.flyTo([BORDEAUX.lat, BORDEAUX.lng], 10, { duration: 1.2 });
    }
  }, [recenterSignal, map]);
  return null;
}

function ZoomTracker({ onZoomChange }) {
  const map = useMapEvents({
    zoomend() { onZoomChange(map.getZoom()); },
  });
  return null;
}

function ClusterFlyController({ target }) {
  const map = useMap();
  const prevTs = useRef(null);
  useEffect(() => {
    if (target && target.ts !== prevTs.current) {
      prevTs.current = target.ts;
      map.flyTo([target.lat, target.lng], CLUSTER_ZOOM_THRESHOLD + 1, { duration: 1.0 });
    }
  }, [target, map]);
  return null;
}

// ── Helper ────────────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return '';
  const [, m, d] = dateStr.split('-');
  const months = ['jan.', 'fév.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sep.', 'oct.', 'nov.', 'déc.'];
  return `${parseInt(d)} ${months[parseInt(m) - 1]}`;
}

// ── Event Detail Bottom Sheet (iOS-style, portal to body) ─────────────────────
function EventDetailSheet({ event, liked, onToggleLike, onClose, onOpenArtist }) {
  const multipleArtists = (event.artists?.length || 0) > 1;
  const ticketsFast     = event.ticketsSellingFast || event.isHot;
  const fewTickets      = typeof event.remainingTickets === 'number' && event.remainingTickets <= 30;
  const isSoldOut       = event.status === 'soldout';

  // Delay backdrop-dismiss so the tap that opened the sheet cannot instantly close it
  const canCloseRef = useRef(false);
  useEffect(() => {
    const t = setTimeout(() => { canCloseRef.current = true; }, 300);
    return () => clearTimeout(t);
  }, []);

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        onClick={() => canCloseRef.current && onClose()}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          zIndex: 1500,
        }}
      />

      {/* Sheet — native iOS bottom sheet feel */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'var(--bg-elevated)',
        borderRadius: '20px 20px 0 0',
        zIndex: 1600,
        maxHeight: '88dvh',
        overflowY: 'auto',
        overscrollBehavior: 'contain',
        animation: 'sheet-slide-up 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: '0 -12px 48px rgba(0,0,0,0.65)',
      }}>
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 6px' }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.2)' }} />
        </div>

        {/* Hero image */}
        {event.image && (
          <div style={{ height: 160, overflow: 'hidden', position: 'relative' }}>
            <img src={event.image} alt={event.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, var(--bg-elevated) 100%)' }} />
          </div>
        )}

        <div style={{ padding: `${event.image ? '4px' : '8px'} 20px calc(env(safe-area-inset-bottom, 20px) + 28px)` }}>

          {/* Name + like */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ flex: 1, paddingRight: '12px' }}>
              <p style={{ fontSize: '22px', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: '10px', fontVariationSettings: "'wdth' 75" }}>
                {event.name}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                {event.artists?.map((a, i) => (
                  <span key={a.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      onClick={() => { if (a.mockId) { onClose(); onOpenArtist(a.mockId); } }}
                      style={{
                        background: 'none', border: 'none', padding: 0,
                        cursor: a.mockId ? 'pointer' : 'default',
                        fontSize: '15px', fontWeight: 700, color: 'var(--accent)',
                        textDecoration: a.mockId ? 'underline' : 'none',
                        textUnderlineOffset: '3px',
                      }}
                    >{a.name}</button>
                    {event.isEmerging && (
                      <span style={{ fontSize: '10px', fontWeight: 700, background: 'rgba(251,146,60,0.15)', color: '#fb923c', border: '1px solid rgba(251,146,60,0.3)', borderRadius: '4px', padding: '2px 6px', textTransform: 'uppercase', letterSpacing: '0.4px', whiteSpace: 'nowrap' }}>
                        à découvrir
                      </span>
                    )}
                    {i < event.artists.length - 1 && <span style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>·</span>}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={onToggleLike}
              style={{
                width: 44, height: 44, borderRadius: '50%',
                background: liked ? 'rgba(162,56,255,0.15)' : 'var(--bg-pressed)',
                border: `1.5px solid ${liked ? 'var(--accent)' : 'var(--border-subtle)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', flexShrink: 0,
                transition: 'all 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                transform: liked ? 'scale(1.08)' : 'scale(1)',
              }}
            >
              <Heart size={18} color={liked ? 'var(--accent)' : 'var(--text-secondary)'} fill={liked ? 'var(--accent)' : 'none'} />
            </button>
          </div>

          {/* Venue + Date */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            <div style={{ flex: 1, padding: '12px', borderRadius: 'var(--r-card)', background: 'var(--bg-pressed)' }}>
              <p style={{ fontSize: '10px', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>Lieu</p>
              <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>{event.venue?.name}</p>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{event.venue?.address}</p>
            </div>
            <div style={{ flex: 1, padding: '12px', borderRadius: 'var(--r-card)', background: 'var(--bg-pressed)' }}>
              <p style={{ fontSize: '10px', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>Date</p>
              <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>{formatDate(event.date)}</p>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{event.time}</p>
            </div>
          </div>

          {/* Price + status */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: fewTickets ? '8px' : 0 }}>
              <span style={{ fontSize: '20px', fontWeight: 900, color: 'var(--text-primary)' }}>
                {isSoldOut ? '—' : event.status === 'free' ? 'Gratuit' : `${event.price}€`}
              </span>
              {isSoldOut ? (
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#ef4444', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', padding: '3px 10px' }}>Complet</span>
              ) : (
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#22c55e', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '6px', padding: '3px 10px' }}>
                  {event.status === 'free' ? 'Entrée libre' : 'Dispo'}
                </span>
              )}
              {ticketsFast && !isSoldOut && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 700, color: '#fb923c', background: 'rgba(251,146,60,0.1)', border: '1px solid rgba(251,146,60,0.25)', borderRadius: '6px', padding: '3px 8px' }}>
                  <Zap size={11} fill="#fb923c" color="#fb923c" strokeWidth={0} />
                  ça part vite
                </span>
              )}
            </div>
            {fewTickets && !isSoldOut && (
              <p style={{ fontSize: '13px', color: '#ef4444', fontWeight: 600 }}>
                ⚠ plus que {event.remainingTickets} places restantes
              </p>
            )}
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              disabled={isSoldOut}
              style={{
                width: '100%', padding: '16px',
                background: isSoldOut ? 'rgba(255,255,255,0.08)' : 'var(--accent)',
                border: 'none', borderRadius: 'var(--r-card-lg)',
                color: isSoldOut ? 'var(--text-tertiary)' : '#fff',
                fontSize: '16px', fontWeight: 800,
                cursor: isSoldOut ? 'default' : 'pointer',
                fontVariationSettings: "'wdth' 75",
              }}
            >
              {isSoldOut ? 'Complet' : 'Prendre un billet'}
            </button>
            <button style={{
              width: '100%', padding: '14px',
              background: 'transparent', border: '1px solid var(--border-default)',
              borderRadius: 'var(--r-card-lg)',
              color: 'var(--text-primary)', fontSize: '14px', fontWeight: 600,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}>
              <Music2 size={16} />
              {multipleArtists ? 'Écouter les artistes' : "Écouter l'artiste"}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function MapPage({ onBack, onOpenArtist }) {
  const [mode, setMode]                     = useState('events');
  const [recenterSignal, setRecenter]       = useState(0);
  const [recentering, setRecentering]       = useState(false);
  const [artistPhotos, setArtistPhotos]     = useState({});
  const [eventPhotoMap, setEventPhotoMap]   = useState({});
  const [geoData, setGeoData]               = useState(null);
  const [selectedEvent, setSelectedEvent]   = useState(null);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [likedEvents, setLikedEvents]       = useState(new Set());
  const [zoomLevel, setZoomLevel]           = useState(6);
  const [genreFilter, setGenreFilter]       = useState('all');
  const [showGenreMenu, setShowGenreMenu]   = useState(false);
  const [targetCluster, setTargetCluster]   = useState(null);
  const [apiArtists, setApiArtists]         = useState([]);
  const [apiLoading, setApiLoading]         = useState(false);
  const [dropdownPos, setDropdownPos]       = useState({ top: 0, left: 0 });
  const genreButtonRef                      = useRef(null);

  // GeoJSON departments
  useEffect(() => {
    fetch('/data/departments.geojson')
      .then(r => r.json())
      .then(setGeoData)
      .catch(() => {});
  }, []);

  // Fetch profile photos for ALL city artists via Deezer API
  // — runs once on mount, fires in parallel, fail-safe per artist
  useEffect(() => {
    CITY_ARTISTS.forEach(artist => {
      searchArtist(artist.name)
        .then(result => {
          const photo = result?.picture_medium || result?.picture_small || '';
          if (photo) setArtistPhotos(prev => ({ ...prev, [artist.name]: photo }));
        })
        .catch(() => {}); // silently ignore per-artist failures
    });
  }, []);

  // Fetch artist photos for event markers (events without a cover image)
  useEffect(() => {
    mapEvents.forEach(evt => {
      if (evt.image) {
        setEventPhotoMap(prev => ({ ...prev, [evt.id]: evt.image }));
      } else if (evt.artists?.[0]?.name) {
        searchArtist(evt.artists[0].name)
          .then(result => {
            if (result?.picture_medium) {
              setEventPhotoMap(prev => ({ ...prev, [evt.id]: result.picture_medium }));
            }
          })
          .catch(() => {});
      }
    });
  }, []);

  // Fetch artists from Deezer API when genre filter changes
  useEffect(() => {
    if (genreFilter === 'all') { setApiArtists([]); return; }
    const q = GENRE_QUERIES[genreFilter] || genreFilter;
    setApiLoading(true);
    setApiArtists([]);
    searchArtistsByGenre(q, 10)
      .then(results => {
        // Spread artists across major French cities (Deezer has no location data)
        const mapped = results.slice(0, FRENCH_CITY_COORDS.length).map((a, i) => ({
          name: a.name,
          photo: a.picture_medium || a.picture || '',
          genre: genreFilter,
          // Deterministic slight offset so overlapping cities don't stack
          lat: FRENCH_CITY_COORDS[i].lat + [0.05, -0.07, 0.03, -0.05, 0.08, -0.03, 0.06, -0.08, 0.02, -0.06][i],
          lng: FRENCH_CITY_COORDS[i].lng + [0.06, -0.05, 0.08, -0.04, 0.07, -0.09, 0.03, -0.06, 0.05, -0.07][i],
          city: FRENCH_CITY_COORDS[i].city,
          streamsMonth: a.nb_fan ? Math.floor(a.nb_fan * 0.06) : 50000 + i * 8000,
          nbFan: a.nb_fan || 0,
          mockId: null,
        }));
        setApiArtists(mapped);
      })
      .catch(() => setApiArtists([]))
      .finally(() => setApiLoading(false));
  }, [genreFilter]);

  // Merge API-fetched photos into CITY_ARTISTS
  const allArtists = CITY_ARTISTS.map(a => ({ ...a, photo: artistPhotos[a.name] || '' }));

  const filteredEvents = genreFilter === 'all'
    ? mapEvents
    : mapEvents.filter(evt => evt.genre === genreFilter);

  // Artists visible in bottom list — filtered by genre, then sorted by streams
  const listArtistsBase = (genreFilter !== 'all' && apiArtists.length > 0)
    ? apiArtists
    : allArtists.filter(a => genreFilter === 'all' || a.genre === genreFilter)
        .sort((a, b) => b.streamsMonth - a.streamsMonth);

  // Spread artists for individual map pins so same-city markers don't overlap
  const spreadForMap = spreadArtists(
    allArtists.filter(a => genreFilter === 'all' || a.genre === genreFilter)
  );

  function handleRecenter() {
    setRecentering(true);
    setRecenter(v => v + 1);
    setTimeout(() => setRecentering(false), 600);
  }

  function toggleLike(eventId) {
    setLikedEvents(prev => {
      const next = new Set(prev);
      if (next.has(eventId)) next.delete(eventId); else next.add(eventId);
      return next;
    });
  }

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', background: 'var(--bg-base)', minHeight: '100vh', paddingBottom: '120px' }}
      onClick={() => showGenreMenu && setShowGenreMenu(false)}
    >

      {/* ── 1. Header & Filters ─────────────────────────────────── */}
      <div style={{ padding: '16px var(--page-h) 0' }}>

        {/* Back + title */}
        <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: '20px' }}>
          <button onClick={onBack} style={{ position: 'absolute', left: 0, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <ChevronLeft size={24} color="var(--text-primary)" />
          </button>
          <h1 style={{ width: '100%', textAlign: 'center', fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
            Deezer test map
          </h1>
        </div>

        {/* Filter pills row */}
        <div className="hide-scrollbar" style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '20px' }}>

          {/* Pour toi — resets genre */}
          <button
            onClick={e => { e.stopPropagation(); setGenreFilter('all'); setShowGenreMenu(false); }}
            style={{
              flexShrink: 0,
              background: genreFilter === 'all' ? 'var(--accent-alpha)' : 'transparent',
              border: `1px solid ${genreFilter === 'all' ? 'var(--accent)' : 'var(--border-default)'}`,
              borderRadius: '9999px', padding: '6px 14px',
              fontSize: '14px', color: genreFilter === 'all' ? 'var(--accent)' : 'var(--text-secondary)', cursor: 'pointer',
            }}
          >Pour toi</button>

          {/* Genre dropdown — button only (menu via portal to escape overflow clip) */}
          <div style={{ flexShrink: 0 }} onClick={e => e.stopPropagation()}>
            {(() => {
              const activeColor = genreFilter !== 'all' ? (GENRE_COLORS[genreFilter] || 'var(--accent)') : null;
              return (
                <button
                  ref={genreButtonRef}
                  onClick={() => {
                    if (!showGenreMenu && genreButtonRef.current) {
                      const rect = genreButtonRef.current.getBoundingClientRect();
                      setDropdownPos({ top: rect.bottom + 6, left: rect.left });
                    }
                    setShowGenreMenu(v => !v);
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    background: activeColor ? `${activeColor}22` : 'transparent',
                    border: `1px solid ${activeColor || 'var(--border-default)'}`,
                    borderRadius: '9999px', padding: '6px 14px',
                    fontSize: '14px',
                    color: activeColor || 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 180ms ease',
                    fontFamily: 'var(--font-primary)',
                  }}
                >
                  {genreFilter !== 'all' ? GENRE_OPTIONS.find(g => g.id === genreFilter)?.label : 'Genre'}
                  <ChevronDown size={14} style={{ transform: showGenreMenu ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }} />
                </button>
              );
            })()}
          </div>

          {/* Date pill — events mode only */}
          {mode === 'events' && (
            <button style={{
              flexShrink: 0, display: 'flex', alignItems: 'center', gap: '4px',
              background: 'transparent', border: '1px solid var(--border-default)',
              borderRadius: '9999px', padding: '6px 14px',
              fontSize: '14px', color: 'var(--text-secondary)', cursor: 'pointer',
            }}>
              Date <ChevronDown size={14} />
            </button>
          )}
        </div>

        {/* Mode tabs */}
        <div style={{
          display: 'flex', marginBottom: '16px',
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid var(--border-default)',
          borderRadius: '9999px', padding: '4px',
        }}>
          {[
            { id: 'events',  label: 'Événements' },
            { id: 'artists', label: 'Artistes' },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => { setMode(id); setSelectedEvent(null); }}
              style={{
                flex: 1, padding: '9px 16px', borderRadius: '9999px', cursor: 'pointer',
                border: 'none',
                background: mode === id ? 'var(--accent)' : 'transparent',
                color: mode === id ? '#fff' : 'var(--text-secondary)',
                fontSize: '14px', fontWeight: mode === id ? 700 : 500,
                transition: 'all 180ms cubic-bezier(0.34,1.56,0.64,1)',
                boxShadow: mode === id ? '0 2px 8px rgba(162,56,255,0.35)' : 'none',
              }}
            >{label}</button>
          ))}
        </div>
      </div>

      {/* ── 2. Interactive Map ──────────────────────────────────── */}
      <div style={{ padding: '0 var(--page-h)', marginBottom: '24px' }}>
        <div style={{ width: '100%', height: '320px', borderRadius: 'var(--r-card-lg)', overflow: 'hidden', position: 'relative' }}>
          <MapContainer
            center={[46.5, 2.5]}
            zoom={6}
            minZoom={5}
            maxBounds={FRANCE_BOUNDS}
            maxBoundsViscosity={1.0}
            style={{ width: '100%', height: '100%', background: '#0d0d0d' }}
            zoomControl={false}
            attributionControl={false}
          >
            {/* CartoDB Dark Matter All — shows streets, labels, borders */}
            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

            <MapController recenterSignal={recenterSignal} />
            <ZoomTracker onZoomChange={setZoomLevel} />
            <ClusterFlyController target={targetCluster} />

            {/* Region / department outlines */}
            {geoData && <GeoJSON key="regions" data={geoData} style={deptStyle} interactive={false} />}

            {/* Event markers */}
            {mode === 'events' && filteredEvents.map(evt => (
              <Marker
                key={`${evt.id}-${selectedEvent?.id === evt.id}-${eventPhotoMap[evt.id] || ''}`}
                position={[evt.lat, evt.lng]}
                icon={getEventIcon(evt, selectedEvent?.id === evt.id, eventPhotoMap[evt.id])}
                eventHandlers={{ click: () => setSelectedEvent(evt) }}
              />
            ))}

            {/* Artist markers — city clusters when zoomed out, individual pins when zoomed in */}
            {mode === 'artists' && (
              zoomLevel < CLUSTER_ZOOM_THRESHOLD
                ? getCityClusters(allArtists, genreFilter).map(cluster => {
                    const clusterColor = GENRE_COLORS[cluster.topGenre] || '#A238FF';
                    const clusterTextColor = GENRE_TEXT[cluster.topGenre] || '#fff';
                    return (
                      <Marker
                        key={`cluster-${cluster.name}`}
                        position={[cluster.lat, cluster.lng]}
                        icon={makeClusterIcon(cluster.count, clusterColor, clusterTextColor)}
                        eventHandlers={{ click: () => setTargetCluster({ lat: cluster.lat, lng: cluster.lng, ts: Date.now() }) }}
                      />
                    );
                  })
                : spreadForMap.map((artist, idx) => (
                    <Marker
                      key={`pin-${artist.name}-${idx}`}
                      position={[artist.lat, artist.lng]}
                      icon={getArtistIcon(artist, selectedArtist === artist.name)}
                      eventHandlers={{
                        click: () => {
                          setSelectedArtist(artist.name);
                          if (artist.mockId) onOpenArtist(artist.mockId);
                        },
                      }}
                    />
                  ))
            )}
          </MapContainer>

          {/* Recenter FAB */}
          <button
            onClick={handleRecenter}
            style={{
              position: 'absolute', bottom: '12px', right: '12px',
              width: 44, height: 44, borderRadius: '50%',
              background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1100, boxShadow: '0 2px 12px rgba(0,0,0,0.5)',
              opacity: recentering ? 0.5 : 1,
              transform: recentering ? 'scale(0.88)' : 'scale(1)',
              transition: 'opacity 200ms ease, transform 200ms ease',
            }}
          >
            <LocateFixed size={20} color="var(--accent)" />
          </button>
        </div>
      </div>

      {/* ── 3. Bottom list ──────────────────────────────────────── */}
      <div style={{ padding: '0 var(--page-h)' }}>

        {mode === 'events' ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                  {genreFilter !== 'all'
                    ? `Événements · ${GENRE_OPTIONS.find(g => g.id === genreFilter)?.label}`
                    : 'Prochain événement'}
                </h2>
                {genreFilter === 'all' && (
                  <div style={{ display: 'inline-block', background: '#222', color: '#fff', fontSize: '13px', padding: '4px 10px', borderRadius: '6px', marginTop: '6px' }}>
                    Dans 10 jours
                  </div>
                )}
              </div>
              <button style={{
                background: 'var(--accent)', color: '#fff', border: 'none',
                padding: '10px 18px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer',
              }}>Voir plus</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredEvents.length === 0 ? (
                <p style={{ fontSize: '14px', color: 'var(--text-tertiary)', textAlign: 'center', padding: '32px 0' }}>
                  Aucun événement pour ce genre
                </p>
              ) : (
                filteredEvents.slice(0, 4).map(evt => {
                  const evtPhoto = evt.image || eventPhotoMap[evt.id];
                  const hue = (evt.artists?.[0]?.name || evt.name).charCodeAt(0) * 47 % 360;
                  return (
                    <div
                      key={evt.id}
                      onClick={() => setSelectedEvent(evt)}
                      style={{ display: 'flex', gap: '12px', alignItems: 'center', cursor: 'pointer' }}
                    >
                      {/* Event thumbnail — uses artist photo or gradient fallback */}
                      <div style={{ width: 48, height: 48, borderRadius: '6px', overflow: 'hidden', flexShrink: 0, background: '#333' }}>
                        {evtPhoto ? (
                          <img
                            src={evtPhoto}
                            alt={evt.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={e => { e.currentTarget.style.display = 'none'; }}
                          />
                        ) : (
                          <div style={{
                            width: '100%', height: '100%',
                            background: `linear-gradient(135deg, hsl(${hue},60%,25%), hsl(${(hue + 60) % 360},70%,40%))`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '18px', fontWeight: 800, color: 'rgba(255,255,255,0.5)',
                          }}>
                            {(evt.artists?.[0]?.name || evt.name)[0]}
                          </div>
                        )}
                      </div>

                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '15px', fontWeight: 'normal', color: 'var(--text-primary)', marginBottom: '2px' }}>
                          {evt.artists?.[0]?.name || 'Artiste'}
                        </p>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{formatDate(evt.date)} • {evt.venue?.name}</p>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {evt.ticketsSellingFast && <Zap size={14} fill="#fb923c" color="#fb923c" strokeWidth={0} />}
                        <button
                          onClick={e => { e.stopPropagation(); toggleLike(evt.id); }}
                          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                        >
                          <Heart
                            size={20}
                            color={likedEvents.has(evt.id) ? 'var(--accent)' : 'var(--text-primary)'}
                            fill={likedEvents.has(evt.id) ? 'var(--accent)' : 'none'}
                          />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        ) : (
          <>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                {genreFilter !== 'all'
                  ? `${GENRE_OPTIONS.find(g => g.id === genreFilter)?.label} — France`
                  : 'Artistes · Top France'}
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                {zoomLevel < CLUSTER_ZOOM_THRESHOLD
                  ? 'Touche un cluster pour zoomer sur la ville'
                  : `${listArtistsBase.length} artiste${listArtistsBase.length > 1 ? 's' : ''} · données Deezer`}
              </p>
            </div>

            {/* Loading skeleton while API fetches */}
            {apiLoading && genreFilter !== 'all' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[...Array(4)].map((_, i) => (
                  <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ width: 32, height: 16, borderRadius: 4, background: 'rgba(255,255,255,0.07)', animation: 'pulse 1.5s infinite' }} />
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', animation: 'pulse 1.5s infinite', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ height: 14, borderRadius: 4, background: 'rgba(255,255,255,0.07)', animation: 'pulse 1.5s infinite', marginBottom: 6, width: '60%' }} />
                      <div style={{ height: 12, borderRadius: 4, background: 'rgba(255,255,255,0.05)', animation: 'pulse 1.5s infinite', width: '40%' }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!apiLoading && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {listArtistsBase.length === 0 ? (
                  <p style={{ fontSize: '14px', color: 'var(--text-tertiary)', textAlign: 'center', padding: '32px 0' }}>
                    Aucun artiste pour ce genre
                  </p>
                ) : listArtistsBase.map((artist, idx) => (
                  <div
                    key={`list-${artist.name}-${idx}`}
                    onClick={() => { if (artist.mockId) onOpenArtist(artist.mockId); }}
                    style={{ display: 'flex', gap: '16px', alignItems: 'center', cursor: artist.mockId ? 'pointer' : 'default' }}
                  >
                    <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', width: '28px', flexShrink: 0 }}>
                      #{idx + 1}
                    </span>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: '#222' }}>
                      {artist.photo
                        ? <img src={artist.photo} alt={artist.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.currentTarget.style.display = 'none'; }} />
                        : <div style={{ width: '100%', height: '100%', background: `hsl(${artist.name.charCodeAt(0) * 47 % 360},50%,28%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 800, color: 'rgba(255,255,255,0.6)' }}>{artist.name[0].toUpperCase()}</div>
                      }
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {artist.name}
                      </p>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {artist.city && <span style={{ marginRight: 4 }}>📍 {artist.city} ·</span>}
                        {artist.nbFan
                          ? `${(artist.nbFan / 1000).toFixed(0)}K fans`
                          : `${(artist.streamsMonth / 1000).toFixed(0)}K streams`
                        }
                      </p>
                    </div>
                    {/* Genre badge */}
                    {(() => {
                      const gc = GENRE_COLORS[artist.genre];
                      return gc ? (
                        <span style={{ fontSize: '10px', fontWeight: 700, color: gc, border: `1px solid ${gc}55`, borderRadius: 4, padding: '2px 6px', flexShrink: 0 }}>
                          {GENRE_OPTIONS.find(g => g.id === artist.genre)?.label || artist.genre}
                        </span>
                      ) : null;
                    })()}
                    <button onClick={e => e.stopPropagation()} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', flexShrink: 0 }}>
                      <Heart size={18} color="var(--text-secondary)" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Genre dropdown portal — outside overflow:auto containers so it renders on top */}
      {showGenreMenu && createPortal(
        <div
          onClick={e => e.stopPropagation()}
          style={{
            position: 'fixed',
            top: dropdownPos.top,
            left: dropdownPos.left,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--r-card)',
            overflow: 'hidden',
            zIndex: 9000,
            minWidth: 160,
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
            animation: 'page-slide-up 0.15s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          {GENRE_OPTIONS.map(g => {
            const gColor = GENRE_COLORS[g.id];
            const isActive = genreFilter === g.id;
            return (
              <button
                key={g.id}
                onClick={() => { setGenreFilter(g.id); setShowGenreMenu(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  width: '100%', padding: '11px 14px',
                  background: isActive ? (gColor ? `${gColor}22` : 'var(--accent-alpha)') : 'transparent',
                  border: 'none', borderBottom: '1px solid var(--border-subtle)',
                  cursor: 'pointer', fontSize: '13px', textAlign: 'left',
                  color: isActive ? (gColor || 'var(--accent)') : 'var(--text-primary)',
                  fontFamily: 'var(--font-primary)',
                }}
              >
                {gColor && (
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: gColor, flexShrink: 0,
                    boxShadow: isActive ? `0 0 6px ${gColor}` : 'none',
                    transition: 'box-shadow 180ms',
                  }} />
                )}
                {g.label}
              </button>
            );
          })}
        </div>,
        document.body
      )}

      {/* Event detail bottom sheet */}
      {selectedEvent && (
        <EventDetailSheet
          event={selectedEvent}
          liked={likedEvents.has(selectedEvent.id)}
          onToggleLike={() => toggleLike(selectedEvent.id)}
          onClose={() => setSelectedEvent(null)}
          onOpenArtist={onOpenArtist}
        />
      )}
    </div>
  );
}
