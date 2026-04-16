import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import { searchPlaylists, getArtist, ARTIST_IDS } from "../api/deezer.js";

const TOP_CATEGORIES = [
  {
    id: "podcasts",
    title: "Podcasts",
    label: "Radios",
    bg: "#ff6145",
    image: "/images/covers/podcasts.jpg",
  },
  {
    id: "blindtest",
    title: "Blind Test",
    label: "Blind Test",
    bg: "#8be8e5",
    image: "/images/covers/blindtest.jpg",
  },
  {
    id: "concerts",
    title: "Concerts",
    label: "Concerts",
    bg: "#f2f04e",
    image: "/images/covers/concerts.jpg",
  },
  {
    id: "radios",
    title: "Radios",
    label: "Podcasts",
    bg: "#919920",
    image: "/images/covers/radios.jpg",
  },
];

const HeartIcon = L.divIcon({
  className: "",
  html: `<svg width="20" height="20" viewBox="0 0 7 7" style="image-rendering:pixelated;" fill="var(--accent)"><path d="M1,2 h1 v-1 h1 v1 h1 v-1 h1 v1 h1 v2 h-1 v1 h-1 v1 h-1 v-1 h-1 v-1 h-1 v-2 z"/></svg>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

function getPreviewArtistIcon(artistInfo) {
  return L.divIcon({
    className: "",
    html: `
      <div style="display:flex; flex-direction:column; align-items:center; width: 64px;">
        <div style="width: 48px; height: 48px; border-radius: 50%; border: 2px solid var(--accent); overflow: hidden; background: #000; box-shadow: 0 4px 10px rgba(0,0,0,0.3)">
          <img src="${artistInfo?.picture_medium || "https://cdns-images.dzcdn.net/images/artist/b17c24f603a11da0c5c4dafb2fbb4778/500x500.jpg"}" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none'" />
        </div>
        <div style="background: #ff7733; color: white; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px; margin-top: -6px; z-index: 10;">
          10/07
        </div>
      </div>
    `,
    iconSize: [64, 64],
    iconAnchor: [32, 24],
  });
}

export default function ExplorerPage({ onOpenMap, onOpenPlayer }) {
  const [playlists, setPlaylists] = useState([]);
  const [aupinard, setAupinard] = useState(null);

  useEffect(() => {
    // 1. Récupérer l'artiste principal de preview
    getArtist(ARTIST_IDS.aupinard)
      .then((a) => setAupinard(a))
      .catch(() => {});

    // 2. Chercher de vraies playlists Deezer pour la grille "Sorties"
    Promise.all([
      searchPlaylists("nouveautés vendredi", 2),
      searchPlaylists("Hits du moment", 2),
      searchPlaylists("Rap Français", 2),
    ])
      .then(([p1, p2, p3]) => {
        setPlaylists([...p1, ...p2, ...p3]);
      })
      .catch(() => {});
  }, []);
  return (
    <div
      style={{
        paddingBottom: "120px",
        minHeight: "100vh",
        background: "var(--bg-base)",
      }}
    >
      {/* 1. Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "16px var(--page-h) 24px",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "#333",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            fontWeight: 700,
            color: "#fff",
            marginRight: "12px",
          }}
        >
          B
        </div>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "var(--text-primary)",
          }}
        >
          Explorer
        </h1>
      </div>

      {/* 2. Top Categories */}
      <div
        className="hide-scrollbar"
        style={{
          display: "flex",
          gap: "12px",
          paddingLeft: "var(--page-h)",
          overflowX: "auto",
          marginBottom: "32px",
        }}
      >
        {TOP_CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              flexShrink: 0,
              width: 140,
            }}
          >
            {/* Rectangular block with complex SVG background */}
            <div
              style={{
                width: 140,
                height: 140,
                borderRadius: "18px",
                background: cat.bg,
                overflow: "hidden",
                position: "relative",
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
              }}
            >
              {cat.image ? (
                <img
                  src={cat.image}
                  alt={cat.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <>
                  <svg
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                    }}
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    {cat.svg}
                  </svg>
                  <span
                    style={{
                      position: "absolute",
                      zIndex: 10,
                      fontSize: "20px",
                      fontWeight: 900,
                      color: "#fff",
                      letterSpacing: "-0.8px",
                      textAlign: "center",
                      padding: "0 10px",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "100%",
                    }}
                  >
                    {cat.title}
                  </span>
                </>
              )}
            </div>
            {/* Labels below */}
            <span
              style={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#fff",
                textAlign: "left",
              }}
            >
              {cat.label}
            </span>
          </div>
        ))}
      </div>

      {/* 3. "What's missing ?" Section */}
      <div style={{ padding: "0 var(--page-h)", marginBottom: "36px" }}>
        <button
          onClick={onOpenMap}
          style={{
            width: "100%",
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 0,
            marginBottom: "14px",
            textAlign: "left",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: "var(--text-primary)",
                marginBottom: "2px",
              }}
            >
              Deezer Map
            </h2>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
              Les événements et artistes près de chez toi
            </p>
          </div>
          <ChevronRight size={20} color="var(--text-secondary)" />
        </button>

        <button
          onClick={onOpenMap}
          style={{
            display: "block",
            width: "100%",
            padding: 0,
            background: "none",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          {/* Map Card with Real Leaflet Map */}
          <div
            style={{
              width: "100%",
              height: 180,
              borderRadius: "var(--r-card-lg)",
              overflow: "hidden",
              position: "relative",
              marginBottom: "12px",
              pointerEvents: "none", // To let the click bubble up to the button
            }}
          >
            <MapContainer
              center={[44.84, -0.58]}
              zoom={10}
              style={{ width: "100%", height: "100%", background: "#ebdfc7" }}
              zoomControl={false}
              scrollWheelZoom={false}
              dragging={false}
              attributionControl={false}
            >
              <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
              <Marker
                position={[44.84, -0.58]}
                icon={HeartIcon}
                zIndexOffset={-50}
              />
              <Marker
                position={[44.84, -0.58]}
                icon={getPreviewArtistIcon(aupinard)}
                zIndexOffset={100}
              />
            </MapContainer>
          </div>
          {/* Below Map Card */}
          <p
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              color: "var(--text-primary)",
              marginBottom: "2px",
            }}
          >
            #1 {aupinard?.name || "Aupinard"}
          </p>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
            prochain événement le 10/07
          </p>
        </button>
      </div>

      {/* 4. "Sorties de la semaine" Section */}
      <div style={{ marginBottom: "32px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 var(--page-h)",
            marginBottom: "16px",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: "var(--text-primary)",
                marginBottom: "2px",
              }}
            >
              Sorties de la semaine
            </h2>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
              Actualisées chaque vendredi par notre équipe
            </p>
          </div>
          <ChevronRight size={20} color="var(--text-secondary)" />
        </div>

        <div
          className="hide-scrollbar"
          style={{
            display: "flex",
            gap: "14px",
            paddingLeft: "var(--page-h)",
            overflowX: "auto",
          }}
        >
          {playlists.length > 0
            ? playlists.map((item) => (
                <button
                  key={item.id}
                  onClick={onOpenPlayer}
                  style={{
                    flexShrink: 0,
                    width: 140,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    padding: 0,
                  }}
                >
                  <div
                    style={{
                      width: 140,
                      height: 140,
                      borderRadius: "8px",
                      overflow: "hidden",
                      marginBottom: "8px",
                      background: "#222",
                    }}
                  >
                    <img
                      src={item.picture_medium || item.picture}
                      alt={item.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: "var(--text-primary)",
                      lineHeight: 1.3,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {item.title}
                  </p>
                </button>
              ))
            : [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    flexShrink: 0,
                    width: 140,
                    height: 140,
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.05)",
                    animation: "pulse 1.5s infinite",
                  }}
                />
              ))}
        </div>
      </div>
    </div>
  );
}
