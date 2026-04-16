import { useState, useEffect, useRef } from 'react';
import { MapContainer, GeoJSON, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { LocateFixed } from 'lucide-react';

// ── Fix Leaflet default icon path (broken with Vite bundler) ─────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const BORDEAUX = { lat: 44.84, lng: -0.58 };

// ── Sub-component : fly to user location or recenter signal ──────────────────
function MapController({ userLocation, recenterSignal }) {
  const map = useMap();
  const prevLocation = useRef(null);
  const prevSignal = useRef(recenterSignal);

  useEffect(() => {
    if (userLocation && userLocation !== prevLocation.current) {
      prevLocation.current = userLocation;
      map.flyTo([userLocation.lat, userLocation.lng], 13, { duration: 1.5 });
    }
  }, [userLocation, map]);

  useEffect(() => {
    if (recenterSignal !== prevSignal.current) {
      prevSignal.current = recenterSignal;
      map.flyTo([BORDEAUX.lat, BORDEAUX.lng], 11, { duration: 1.2 });
    }
  }, [recenterSignal, map]);

  return null;
}

// ── Build a DivIcon for an event marker ──────────────────────────────────────
function makeMarkerIcon(event, isSelected) {
  const borderColor = isSelected
    ? '#A238FF'
    : event.isHot
    ? '#FF4444'
    : 'rgba(255,255,255,0.25)';

  const inner = event.image
    ? `<img src="${event.image}" style="width:100%;height:100%;object-fit:cover;border-radius:50%" />`
    : `<div style="width:100%;height:100%;border-radius:50%;background:linear-gradient(135deg,hsl(${event.name.charCodeAt(0)*47%360},60%,20%),hsl(${(event.name.charCodeAt(0)*47+60)%360},70%,40%));display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:800;color:rgba(255,255,255,0.5)">${event.venue.name[0]}</div>`;

  const hotBadge = event.isHot
    ? `<div style="position:absolute;top:-4px;right:-4px;font-size:13px;line-height:1">🔥</div>`
    : '';

  const freeBadge = event.status === 'free'
    ? `<div style="position:absolute;bottom:-6px;left:50%;transform:translateX(-50%);background:#22c55e;color:#fff;font-size:9px;font-weight:700;padding:1px 5px;border-radius:6px;white-space:nowrap">Gratuit</div>`
    : '';

  return L.divIcon({
    className: '',
    html: `<div style="position:relative;width:44px;height:44px">
      <div style="width:44px;height:44px;border-radius:50%;border:2.5px solid ${borderColor};overflow:hidden;background:#1a1a1a;${isSelected ? 'box-shadow:0 0 0 3px rgba(162,56,255,0.3)' : ''}">
        ${inner}
      </div>
      ${hotBadge}
      ${freeBadge}
    </div>`,
    iconSize:   [44, 44],
    iconAnchor: [22, 22],
  });
}

// ── User location dot ─────────────────────────────────────────────────────────
const userIcon = L.divIcon({
  className: '',
  html: `<div style="width:16px;height:16px;border-radius:50%;background:#A238FF;border:3px solid #fff;box-shadow:0 0 0 4px rgba(162,56,255,0.25)"></div>`,
  iconSize:   [16, 16],
  iconAnchor: [8, 8],
});

// ── Main EventsMode component ─────────────────────────────────────────────────
export default function EventsMode({
  events,
  selectedEvent,
  userLocation,
  onSelectEvent,
  onUserLocated,
  showGeoPrompt,
  onGeoPromptAccept,
  onGeoPromptDismiss,
}) {
  const [geoData, setGeoData] = useState(null);
  const [recenterSignal, setRecenterSignal] = useState(0);
  const [recentering, setRecentering] = useState(false);

  useEffect(() => {
    fetch('/data/departments.geojson')
      .then(r => r.json())
      .then(setGeoData)
      .catch(() => {});
  }, []);

  const deptStyle = {
    fillColor: 'rgba(255,255,255,0.03)',
    fillOpacity: 1,
    color: 'rgba(255,255,255,0.15)',
    weight: 1,
  };

  function handleRecenter() {
    setRecentering(true);
    setRecenterSignal(v => v + 1);
    setTimeout(() => setRecentering(false), 600);
  }

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <MapContainer
        center={[BORDEAUX.lat, BORDEAUX.lng]}
        zoom={11}
        style={{ height: '100%', width: '100%', background: '#121216' }}
        zoomControl={false}
        attributionControl={false}
      >
        <MapController userLocation={userLocation} recenterSignal={recenterSignal} />

        {geoData && <GeoJSON data={geoData} style={deptStyle} interactive={false} />}

        {/* Event markers */}
        {events.map(evt => (
          <Marker
            key={evt.id}
            position={[evt.lat, evt.lng]}
            icon={makeMarkerIcon(evt, selectedEvent?.id === evt.id)}
            eventHandlers={{ click: () => onSelectEvent(evt) }}
          />
        ))}

        {/* User location dot */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon} />
        )}
      </MapContainer>

      {/* Geo prompt popup ─────────────────────────────────────────────────── */}
      {showGeoPrompt && (
        <div style={{
          position: 'absolute', bottom: '80px', left: '16px', right: '16px',
          background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
          borderRadius: 'var(--r-card-lg)', padding: '16px', zIndex: 1100,
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        }}>
          <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Ce qu'il se passe autour de toi
          </p>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.4 }}>
            Autorise ta localisation pour découvrir les événements à proximité.
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={onGeoPromptAccept} style={{
              flex: 1, padding: '11px', background: 'var(--gradient-flow)', border: 'none',
              borderRadius: 'var(--r-card)', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
            }}>
              Localiser
            </button>
            <button onClick={onGeoPromptDismiss} style={{
              flex: 1, padding: '11px', background: 'var(--bg-pressed)', border: 'none',
              borderRadius: 'var(--r-card)', color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer',
            }}>
              Plus tard
            </button>
          </div>
        </div>
      )}

      {/* Recenter FAB ───────────────────────────────────────────────────── */}
      <button
        onClick={handleRecenter}
        style={{
          position: 'absolute', bottom: '80px', right: '16px',
          width: 44, height: 44, borderRadius: '50%',
          background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1100, boxShadow: '0 2px 12px rgba(0,0,0,0.5)',
          opacity: recentering ? 0.5 : 1,
          transform: recentering ? 'scale(0.9)' : 'scale(1)',
          transition: 'opacity 200ms ease, transform 200ms ease',
        }}
      >
        <LocateFixed size={20} color="var(--accent)" />
      </button>
    </div>
  );
}
