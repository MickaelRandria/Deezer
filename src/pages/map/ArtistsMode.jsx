import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { LocateFixed } from 'lucide-react';
import { deptArtists } from '../../data/mapData.js';

// ── Helpers ──────────────────────────────────────────────────────────────────
function getTopArtist(dept, filters) {
  let list = [...dept.artists];
  if (filters.genre !== 'all') list = list.filter(a => a.genre === filters.genre);
  if (!list.length) return null;
  if (filters.sort === 'trending') {
    const priority = { up: 3, new: 2, stable: 1, down: 0 };
    return list.sort((a, b) => (priority[b.trend] || 0) - (priority[a.trend] || 0))[0];
  }
  if (filters.sort === 'new') {
    return list.find(a => a.trend === 'new') || list.sort((a, b) => b.streamsMonth - a.streamsMonth)[0];
  }
  return list.sort((a, b) => b.streamsMonth - a.streamsMonth)[0];
}

function makeArtistIcon(artist, isSelected) {
  const isChampion = artist.isChampion;
  const isVeteran  = artist.monthsChampion >= 3;

  const borderColor = isSelected
    ? '#A238FF'
    : isChampion
    ? '#FFD700'
    : 'rgba(255,255,255,0.2)';

  const shadow = isVeteran && isChampion
    ? `0 0 0 3px rgba(255,215,0,0.3), 0 0 10px rgba(255,215,0,0.2)`
    : isSelected
    ? `0 0 0 3px rgba(162,56,255,0.35)`
    : '0 2px 8px rgba(0,0,0,0.5)';

  const hue = artist.name.charCodeAt(0) * 47 % 360;

  const inner = artist.photo
    ? `<img src="${artist.photo}" style="width:100%;height:100%;object-fit:cover;border-radius:50%"
         onerror="this.style.display='none'" />`
    : `<div style="width:100%;height:100%;border-radius:50%;background:hsl(${hue},60%,25%);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;color:rgba(255,255,255,0.5)">${artist.name[0]}</div>`;

  const crown = isChampion
    ? `<div style="position:absolute;top:-7px;left:50%;transform:translateX(-50%);font-size:14px;line-height:1;z-index:10">🥇</div>`
    : '';

  const trendDot = artist.trend === 'up'
    ? `<div style="position:absolute;bottom:-2px;right:-2px;width:12px;height:12px;border-radius:50%;background:#22c55e;border:2px solid #1a1a1a;z-index:10"></div>`
    : artist.trend === 'new'
    ? `<div style="position:absolute;bottom:-2px;right:-2px;width:12px;height:12px;border-radius:50%;background:#f59e0b;border:2px solid #1a1a1a;z-index:10"></div>`
    : '';

  const animClass = isChampion ? 'marker-champion' : '';

  return L.divIcon({
    className: '',
    html: `<div style="position:relative;width:52px;padding-top:10px">
      ${crown}
      <div class="${animClass}" style="width:52px;height:52px;border-radius:50%;border:2.5px solid ${borderColor};overflow:hidden;background:#1a1a1a;box-shadow:${shadow};position:relative">
        ${inner}
        ${trendDot}
      </div>
    </div>`,
    iconSize:   [52, 62],
    iconAnchor: [26, 31],
  });
}

// ── Map controller : fly to user or France ───────────────────────────────────
function MapController({ userLocation, recenterSignal }) {
  const map = useMap();
  const prevLoc = useRef(null);
  const prevSignal = useRef(recenterSignal);

  useEffect(() => {
    if (userLocation && userLocation !== prevLoc.current) {
      prevLoc.current = userLocation;
      map.flyTo([userLocation.lat, userLocation.lng], 8, { duration: 1.5 });
    }
  }, [userLocation, map]);

  useEffect(() => {
    if (recenterSignal !== prevSignal.current) {
      prevSignal.current = recenterSignal;
      map.flyTo([44.84, -0.58], 9, { duration: 1.2 });
    }
  }, [recenterSignal, map]);

  return null;
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ArtistsMode({ selectedDept, filters, onSelectDept }) {
  const [geoData, setGeoData]       = useState(null);
  const [recenterSignal, setRecenter] = useState(0);

  // Load GeoJSON
  useEffect(() => {
    fetch('/data/departments.geojson')
      .then(r => r.json())
      .then(setGeoData)
      .catch(() => {});
  }, []);

  // GeoJSON style per feature
  function deptStyle(feature) {
    const num = feature.properties?.code;
    const isSelected = selectedDept?.num === num;
    const hasDept = !!deptArtists[num];
    return {
      fillColor:   isSelected ? 'rgba(162,56,255,0.3)' : hasDept ? 'rgba(162,56,255,0.08)' : 'rgba(255,255,255,0.03)',
      fillOpacity: 1,
      color:       isSelected ? '#A238FF' : hasDept ? 'rgba(162,56,255,0.6)' : 'rgba(255,255,255,0.15)',
      weight:      isSelected ? 2 : hasDept ? 1.5 : 0.8,
    };
  }

  function onEachFeature(feature, layer) {
    const num = feature.properties?.code;
    const dept = deptArtists[num];
    if (dept) {
      layer.on('click', () => onSelectDept(dept));
    }
  }

  // Visible dept list filtered
  const visibleDepts = Object.values(deptArtists).filter(dept => {
    const top = getTopArtist(dept, filters);
    return !!top;
  });

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <MapContainer
        center={[44.84, -0.58]}
        zoom={9}
        style={{ height: '100%', width: '100%', background: '#121216' }}
        zoomControl={false}
        attributionControl={false}
      >
        <MapController userLocation={null} recenterSignal={recenterSignal} />

        {/* Department polygons */}
        {geoData && (
          <GeoJSON
            key={`${selectedDept?.num}-${JSON.stringify(filters)}`}
            data={geoData}
            style={deptStyle}
            onEachFeature={onEachFeature}
          />
        )}

        {/* Artist bubbles */}
        {visibleDepts.map(dept => {
          const topArtist = getTopArtist(dept, filters);
          if (!topArtist) return null;
          return (
            <Marker
              key={`${dept.num}-${filters.genre}-${filters.sort}`}
              position={[dept.lat, dept.lng]}
              icon={makeArtistIcon(topArtist, selectedDept?.num === dept.num)}
              eventHandlers={{ click: () => onSelectDept(dept) }}
            />
          );
        })}
      </MapContainer>

      {/* Recenter button */}
      <button
        onClick={() => setRecenter(v => v + 1)}
        style={{
          position: 'absolute', bottom: '80px', right: '16px',
          width: 44, height: 44, borderRadius: '50%',
          background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1100, boxShadow: '0 2px 12px rgba(0,0,0,0.5)',
        }}
      >
        <LocateFixed size={20} color="var(--accent)" />
      </button>
    </div>
  );
}
