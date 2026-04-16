import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronDown, Heart, LocateFixed, Zap, Music2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, GeoJSON, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { mapEvents, deptArtists } from '../data/mapData.js';
import { searchArtist } from '../api/deezer.js';

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

// Bordeaux local artists — includes Pop newcomers
const BORDEAUX_ARTISTS = [
  { name: 'Aupinard',      mockId: 2,    genre: 'rnb',  streamsMonth: 480000, lat: 44.840, lng: -0.577 },
  { name: 'Khali',         mockId: null, genre: 'rap',  streamsMonth: 320000, lat: 44.855, lng: -0.562 },
  { name: 'Odezenne',      mockId: null, genre: 'rap',  streamsMonth: 280000, lat: 44.828, lng: -0.598 },
  { name: 'Julien Granel', mockId: null, genre: 'pop',  streamsMonth: 175000, lat: 44.847, lng: -0.571 },
  { name: 'Pépite',        mockId: null, genre: 'pop',  streamsMonth: 95000,  lat: 44.839, lng: -0.582 },
  { name: "Sam's",         mockId: null, genre: 'rnb',  streamsMonth: 145000, lat: 44.832, lng: -0.565 },
];

// ── Region colours for GeoJSON overlay ───────────────────────────────────────
const REGION_COLORS = {
  'Hauts-de-France':               '#3B82F6',
  'Normandie':                     '#10B981',
  'Grand Est':                     '#F59E0B',
  'Île-de-France':                 '#8B5CF6',
  'Bretagne':                      '#EC4899',
  'Pays de la Loire':              '#14B8A6',
  'Nouvelle-Aquitaine':            '#A238FF',
  'Occitanie':                     '#F97316',
  'Auvergne-Rhône-Alpes':         '#EF4444',
  "Provence-Alpes-Côte d'Azur":   '#06B6D4',
  'Centre-Val de Loire':           '#84CC16',
  'Bourgogne-Franche-Comté':      '#F43F5E',
  'Corse':                         '#0EA5E9',
};

function deptStyle(feature) {
  const code = feature.properties?.code;
  const dept = Object.values(deptArtists).find(d => d.num === code);
  const color = dept ? (REGION_COLORS[dept.region] || '#A238FF') : null;
  if (color) return { fillColor: color, fillOpacity: 0.18, color, weight: 1.2, opacity: 0.6 };
  return { fillColor: '#555', fillOpacity: 0.04, color: '#444', weight: 0.5, opacity: 0.3 };
}

// ── Clustering helpers ────────────────────────────────────────────────────────
function getRegionClusters(genreFilter) {
  const regions = {};
  Object.values(deptArtists).forEach(dept => {
    let artists = [...dept.artists];
    if (genreFilter !== 'all') artists = artists.filter(a => a.genre === genreFilter);
    if (!artists.length) return;
    const key = dept.region;
    if (!regions[key]) regions[key] = { name: key, lats: [], lngs: [], count: 0 };
    regions[key].lats.push(dept.lat);
    regions[key].lngs.push(dept.lng);
    regions[key].count += artists.length;
  });
  return Object.values(regions)
    .filter(r => r.count > 0)
    .map(r => ({
      ...r,
      lat: r.lats.reduce((a, b) => a + b, 0) / r.lats.length,
      lng: r.lngs.reduce((a, b) => a + b, 0) / r.lngs.length,
    }));
}

function makeClusterIcon(count) {
  const sz = count > 9 ? 62 : 54;
  return L.divIcon({
    className: '',
    html: `<div style="width:${sz}px;height:${sz}px;border-radius:50%;background:rgba(162,56,255,0.9);border:2px solid rgba(162,56,255,0.5);box-shadow:0 0 0 8px rgba(162,56,255,0.14),0 4px 20px rgba(0,0,0,0.55);display:flex;align-items:center;justify-content:center;flex-direction:column;cursor:pointer;"><span style="font-size:${count > 9 ? 18 : 22}px;font-weight:900;color:#fff;line-height:1;">${count}</span><span style="font-size:8px;color:rgba(255,255,255,0.7);font-weight:600;margin-top:1px;">artistes</span></div>`,
    iconSize: [sz, sz],
    iconAnchor: [sz / 2, sz / 2],
  });
}

function getTopArtistForDept(dept, genreFilter) {
  let list = [...dept.artists];
  if (genreFilter !== 'all') list = list.filter(a => a.genre === genreFilter);
  if (!list.length) return null;
  return list.sort((a, b) => b.streamsMonth - a.streamsMonth)[0];
}

// ── Marker icon builders ──────────────────────────────────────────────────────
function getEventIcon(evt, isSelected, photo) {
  const [, m, d] = (evt.date || '').split('-');
  const dateStr = m && d ? `${d}/${m}` : '—';
  const border = isSelected ? '#A238FF' : 'rgba(255,255,255,0.35)';
  const ring   = isSelected ? 'box-shadow:0 0 0 3px rgba(162,56,255,0.35);' : '';
  const imgSrc = photo || evt.image || '';
  const hue    = (evt.artists?.[0]?.name || evt.name || 'E').charCodeAt(0) * 47 % 360;
  const initial = (evt.artists?.[0]?.name || evt.name || 'E')[0].toUpperCase();
  const inner = imgSrc
    ? `<img src="${imgSrc}" style="width:100%;height:100%;object-fit:cover;border-radius:50%" onerror="this.onerror=null;this.style.display='none';this.parentNode.innerHTML='<div style=\\'width:100%;height:100%;border-radius:50%;background:linear-gradient(135deg,hsl(${hue},60%,30%),hsl(${(hue + 60) % 360},70%,50%));display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;color:rgba(255,255,255,0.9)\\'>${initial}</div>'" />`
    : `<div style="width:100%;height:100%;border-radius:50%;background:linear-gradient(135deg,hsl(${hue},60%,30%),hsl(${(hue + 60) % 360},70%,50%));display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;color:rgba(255,255,255,0.9)">${initial}</div>`;
  return L.divIcon({
    className: '',
    html: `<div style="display:flex;flex-direction:column;align-items:center;width:64px;cursor:pointer"><div style="width:48px;height:48px;border-radius:50%;border:2.5px solid ${border};overflow:hidden;background:#1a1a1a;${ring}">${inner}</div><div style="background:#ff7733;color:#fff;font-size:10px;font-weight:bold;padding:2px 6px;border-radius:4px;margin-top:-6px;z-index:10">${dateStr}</div></div>`,
    iconSize: [64, 64],
    iconAnchor: [32, 24],
  });
}

function getArtistIcon(artist, isSelected) {
  const border = isSelected ? '#A238FF' : 'var(--accent)';
  const shadow = isSelected ? 'box-shadow:0 0 0 3px rgba(162,56,255,0.35);' : '';
  const hue    = artist.name.charCodeAt(0) * 47 % 360;
  const inner  = artist.photo
    ? `<img src="${artist.photo}" style="width:100%;height:100%;object-fit:cover;border-radius:50%" onerror="this.style.display='none'" />`
    : `<div style="width:100%;height:100%;border-radius:50%;background:hsl(${hue},50%,25%);display:flex;align-items:center;justify-content:center;font-size:17px;font-weight:800;color:rgba(255,255,255,0.5)">${artist.name[0]}</div>`;
  return L.divIcon({
    className: '',
    html: `<div style="width:48px;height:48px;border-radius:50%;border:2.5px solid ${border};overflow:hidden;background:#1a1a1a;${shadow}cursor:pointer">${inner}</div>`,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
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

  // GeoJSON departments
  useEffect(() => {
    fetch('/data/departments.geojson')
      .then(r => r.json())
      .then(setGeoData)
      .catch(() => {});
  }, []);

  // Fetch artist photos for Bordeaux list
  useEffect(() => {
    BORDEAUX_ARTISTS.forEach(artist => {
      searchArtist(artist.name)
        .then(result => {
          if (result?.picture_medium) {
            setArtistPhotos(prev => ({ ...prev, [artist.name]: result.picture_medium }));
          }
        })
        .catch(() => {});
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

  const artists = BORDEAUX_ARTISTS.map(a => ({ ...a, photo: artistPhotos[a.name] || '' }));

  const filteredEvents = genreFilter === 'all'
    ? mapEvents
    : mapEvents.filter(evt => evt.genre === genreFilter);

  const filteredArtists = genreFilter === 'all'
    ? artists
    : artists.filter(a => a.genre === genreFilter);

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
            Deezer map
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

          {/* Genre dropdown */}
          <div style={{ position: 'relative', flexShrink: 0 }} onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setShowGenreMenu(v => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                background: genreFilter !== 'all' ? 'var(--accent-alpha)' : 'transparent',
                border: `1px solid ${genreFilter !== 'all' ? 'var(--accent)' : 'var(--border-default)'}`,
                borderRadius: '9999px', padding: '6px 14px',
                fontSize: '14px',
                color: genreFilter !== 'all' ? 'var(--accent)' : 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              {genreFilter !== 'all' ? GENRE_OPTIONS.find(g => g.id === genreFilter)?.label : 'Genre'}
              <ChevronDown size={14} style={{ transform: showGenreMenu ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }} />
            </button>
            {showGenreMenu && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 6px)', left: 0,
                background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
                borderRadius: 'var(--r-card)', overflow: 'hidden', zIndex: 2000, minWidth: 140,
                boxShadow: '0 8px 24px rgba(0,0,0,0.55)',
              }}>
                {GENRE_OPTIONS.map(g => (
                  <button
                    key={g.id}
                    onClick={() => { setGenreFilter(g.id); setShowGenreMenu(false); }}
                    style={{
                      display: 'block', width: '100%', padding: '10px 14px',
                      background: genreFilter === g.id ? 'var(--accent-alpha)' : 'transparent',
                      border: 'none', borderBottom: '1px solid var(--border-subtle)',
                      cursor: 'pointer', fontSize: '13px', textAlign: 'left',
                      color: genreFilter === g.id ? 'var(--accent)' : 'var(--text-primary)',
                      fontFamily: 'var(--font-primary)',
                    }}
                  >{g.label}</button>
                ))}
              </div>
            )}
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
            {/* Dark Deezer-branded tile layer — CartoDB Dark Matter */}
            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_matter/{z}/{x}/{y}{r}.png" />

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

            {/* Artist markers — clusters when zoomed out, individual pins when zoomed in */}
            {mode === 'artists' && (
              zoomLevel < CLUSTER_ZOOM_THRESHOLD
                ? getRegionClusters(genreFilter).map(cluster => (
                    <Marker
                      key={`cluster-${cluster.name}`}
                      position={[cluster.lat, cluster.lng]}
                      icon={makeClusterIcon(cluster.count)}
                      eventHandlers={{ click: () => setTargetCluster({ ...cluster, ts: Date.now() }) }}
                    />
                  ))
                : Object.values(deptArtists).map(dept => {
                    const artist = getTopArtistForDept(dept, genreFilter);
                    if (!artist) return null;
                    return (
                      <Marker
                        key={`dept-${dept.num}-${genreFilter}`}
                        position={[dept.lat, dept.lng]}
                        icon={getArtistIcon(artist, selectedArtist === artist.name)}
                        eventHandlers={{
                          click: () => {
                            setSelectedArtist(artist.name);
                            if (artist.mockId) onOpenArtist(artist.mockId);
                          },
                        }}
                      />
                    );
                  })
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
                  ? `Artistes · ${GENRE_OPTIONS.find(g => g.id === genreFilter)?.label}`
                  : 'Meilleurs artistes de chez toi'}
              </h2>
              {zoomLevel < CLUSTER_ZOOM_THRESHOLD && (
                <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                  Touche un cluster pour zoomer sur la région
                </p>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredArtists.length === 0 ? (
                <p style={{ fontSize: '14px', color: 'var(--text-tertiary)', textAlign: 'center', padding: '32px 0' }}>
                  Aucun artiste pour ce genre
                </p>
              ) : (
                filteredArtists.map((artist, idx) => (
                  <div
                    key={artist.name}
                    onClick={() => { if (artist.mockId) onOpenArtist(artist.mockId); }}
                    style={{ display: 'flex', gap: '16px', alignItems: 'center', cursor: artist.mockId ? 'pointer' : 'default' }}
                  >
                    <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-primary)', width: '32px' }}>#{idx + 1}</span>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: '#333' }}>
                      {artist.photo
                        ? <img src={artist.photo} alt={artist.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <div style={{ width: '100%', height: '100%', background: `hsl(${artist.name.charCodeAt(0) * 47 % 360},50%,25%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 800, color: 'rgba(255,255,255,0.5)' }}>{artist.name[0]}</div>
                      }
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '2px' }}>{artist.name}</p>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{artist.streamsMonth.toLocaleString('fr-FR')} streams</p>
                    </div>
                    <button onClick={e => e.stopPropagation()} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                      <Heart size={20} color="var(--text-primary)" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

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
