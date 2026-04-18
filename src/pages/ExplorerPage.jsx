import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { searchPlaylists, getArtist, ARTIST_IDS } from "../api/deezer.js";

// Aupinard guaranteed fallback — CDN URL that never changes
const AUPINARD_FALLBACK =
  "https://cdn-images.dzcdn.net/images/artist/b17c24f603a11da0c5c4dafb2fbb4778/250x250-000000-80-0-0.jpg";

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

      {/* 3. Map Immersive */}
      <div style={{ marginBottom: "36px" }}>
        <button
          onClick={onOpenMap}
          className="pressable"
          style={{
            display: "block",
            width: "100%",
            padding: 0,
            background: "none",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
          }}
          aria-label="Explorer la carte Deezer"
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              height: 230,
              overflow: "hidden",
              backgroundImage: "url('https://a.basemaps.cartocdn.com/dark_all/12/2034/1461.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              maskImage: "linear-gradient(to bottom, transparent 0%, black 14%, black 80%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 14%, black 80%, transparent 100%)",
            }}
          >
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.42)", pointerEvents: "none" }} />
            <div className="map-shimmer" />

            {/* GPS Route SVG */}
            <svg
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 2 }}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <filter id="route-glow" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="1" result="blur"/>
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>
              <path
                d="M 19 73 C 35 45, 65 52, 79 26"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="0.8"
                strokeLinecap="round"
                filter="url(#route-glow)"
                className="gps-route"
              />
            </svg>

            {/* User dot — bottom-left */}
            <div
              style={{
                position: "absolute",
                left: "19%",
                top: "73%",
                transform: "translate(-50%, -50%)",
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#4d9fff",
                boxShadow: "0 0 0 3px rgba(77,159,255,0.25), 0 0 14px rgba(77,159,255,0.75)",
                zIndex: 3,
                pointerEvents: "none",
              }}
            />

            {/* Artist — pin + sonar + avatar (top-right) */}
            <div
              style={{
                position: "absolute",
                left: "70%",
                top: "10%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                zIndex: 4,
              }}
            >
              <div className="map-pin-bounce" style={{ marginBottom: 2 }}>
                <svg width="14" height="20" viewBox="0 0 14 20" fill="none" aria-hidden="true">
                  <path d="M7 0C3.13 0 0 3.13 0 7c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S5.62 4.5 7 4.5s2.5 1.12 2.5 2.5S8.38 9.5 7 9.5z" fill="var(--accent)"/>
                </svg>
              </div>
              <div style={{ position: "relative", width: 52, height: 52 }}>
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      border: "1px solid var(--accent)",
                      animation: `pulseRing 2.4s ${i * 0.8}s ease-out infinite`,
                      pointerEvents: "none",
                    }}
                  />
                ))}
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    border: "2px solid var(--accent)",
                    overflow: "hidden",
                    background: "#1a1a2e",
                    boxShadow: "0 0 0 4px rgba(162,56,255,0.2), 0 0 24px rgba(162,56,255,0.55)",
                    position: "relative",
                    zIndex: 2,
                  }}
                >
                  <img
                    src={aupinard?.picture_medium || AUPINARD_FALLBACK}
                    alt="Aupinard"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={e => { e.currentTarget.src = AUPINARD_FALLBACK; }}
                  />
                </div>
              </div>
            </div>

            {/* Overlay text */}
            <div style={{ position: "absolute", bottom: 28, left: 16, zIndex: 5, pointerEvents: "none" }}>
              <p
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#fff",
                  fontVariationSettings: "'wdth' 75",
                  textShadow: "0 2px 16px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,1)",
                  lineHeight: 1.2,
                  marginBottom: 6,
                }}
              >
                Événements & Artistes<br />autour de toi
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Explorer la carte
                </span>
                <ChevronRight size={11} color="var(--accent)" />
              </div>
            </div>

            {/* Bordeaux glass pill */}
            <div
              style={{
                position: "absolute",
                top: 16,
                left: 16,
                display: "flex",
                alignItems: "center",
                gap: 5,
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.18)",
                borderRadius: 9999,
                padding: "4px 10px",
                fontSize: 11,
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "0.3px",
                pointerEvents: "none",
                zIndex: 5,
              }}
            >
              <svg width="9" height="12" viewBox="0 0 9 12" fill="none" aria-hidden="true">
                <path d="M4.5 0C2.29 0 .5 1.79.5 4c0 3 4 8 4 8s4-5 4-8c0-2.21-1.79-4-4-4zm0 5.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" fill="#fff"/>
              </svg>
              Bordeaux
            </div>
          </div>
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
