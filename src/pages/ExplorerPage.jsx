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
        >
          {/* Pure-CSS dark map illusion — no Leaflet, no grey flicker */}
          <div
            style={{
              width: "100%",
              height: 210,
              borderRadius: "var(--r-card-lg)",
              overflow: "hidden",
              position: "relative",
              marginBottom: "12px",
              background: "#080b14",
              border: "1px solid rgba(162,56,255,0.2)",
            }}
          >
            {/* Slow-panning dark city grid */}
            <div
              style={{
                position: "absolute",
                inset: "-15%",
                backgroundImage: [
                  "repeating-linear-gradient(0deg,   transparent, transparent 29px, rgba(162,56,255,0.07) 30px)",
                  "repeating-linear-gradient(90deg,  transparent, transparent 29px, rgba(162,56,255,0.07) 30px)",
                  "repeating-linear-gradient(0deg,   transparent, transparent 89px, rgba(162,56,255,0.04) 90px)",
                  "repeating-linear-gradient(90deg,  transparent, transparent 89px, rgba(162,56,255,0.04) 90px)",
                  "radial-gradient(ellipse 80% 60% at 50% 50%, #14102a 0%, #080b14 100%)",
                ].join(", "),
                animation: "mapPan 18s ease-in-out infinite",
              }}
            />

            {/* Bottom gradient — blends card into page background */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 90,
                background: "linear-gradient(to bottom, rgba(0,0,0,0.1), var(--bg-base))",
                pointerEvents: "none",
              }}
            />

            {/* Pulse rings behind avatar */}
            {[0, 1].map(i => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: "46%",
                  left: "50%",
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  border: "1.5px solid var(--accent)",
                  animation: `pulseRing 2.4s ${i * 1.2}s ease-out infinite`,
                  pointerEvents: "none",
                }}
              />
            ))}

            {/* Single centered Aupinard avatar */}
            <div
              style={{
                position: "absolute",
                top: "46%",
                left: "50%",
                transform: "translate(-50%, -58%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  border: "2px solid var(--accent)",
                  overflow: "hidden",
                  background: "#1a1a2e",
                  boxShadow: "0 0 20px rgba(162,56,255,0.5), 0 4px 16px rgba(0,0,0,0.6)",
                }}
              >
                <img
                  src={aupinard?.picture_medium || AUPINARD_FALLBACK}
                  alt="Aupinard"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={e => { e.currentTarget.src = AUPINARD_FALLBACK; }}
                />
              </div>
              {/* Event date badge */}
              <div
                style={{
                  background: "#ff7733",
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "2px 7px",
                  borderRadius: 4,
                  marginTop: -6,
                  zIndex: 10,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
                }}
              >
                10/07
              </div>
            </div>

            {/* Bordeaux glass pill — top-left */}
            <div
              style={{
                position: "absolute",
                top: 12,
                left: 12,
                display: "flex",
                alignItems: "center",
                gap: 5,
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                borderRadius: 9999,
                padding: "4px 10px",
                fontSize: 11,
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "0.3px",
                pointerEvents: "none",
              }}
            >
              <svg width="9" height="12" viewBox="0 0 9 12" fill="none" aria-hidden="true">
                <path d="M4.5 0C2.29 0 .5 1.79.5 4c0 3 4 8 4 8s4-5 4-8c0-2.21-1.79-4-4-4zm0 5.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" fill="#fff"/>
              </svg>
              Bordeaux
            </div>
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
