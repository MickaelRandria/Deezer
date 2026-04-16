import { useState, useEffect, useRef } from "react";
import {
  Heart as HeartIcon,
  Share2 as ShareIcon,
  Play as PlayIcon,
  ChevronRight as ChevronIcon,
  CheckCircle2 as CheckIcon,
  ArrowLeft,
} from "lucide-react";

function SectionTitle({ children, onMore, moreLabel = "Voir plus" }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "14px",
      }}
    >
      <h2
        style={{
          fontSize: "18px",
          fontWeight: 700,
          color: "var(--text-primary)",
        }}
      >
        {children}
      </h2>
      {onMore && (
        <button
          onClick={onMore}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-secondary)",
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            gap: "3px",
          }}
        >
          {moreLabel} <ChevronIcon size={14} />
        </button>
      )}
    </div>
  );
}

export default function ProfileView({
  artist,
  artistInfo,
  topTracks,
  apiAlbums,
  relatedArtists,
  apiPlaylists,
  onBack,
  onOpenPlayer,
  onViewBio,
  onViewBackstage,
}) {
  const [liked, setLiked] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);
  const heroRef = useRef(null);

  // Show sticky header once the hero scrolls out of view
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setStickyVisible(!entry.isIntersecting),
      { threshold: 0, rootMargin: "0px 0px 0px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ── Photo hero : priorité picture_xl API → picture_big → fallback mockData
  const heroPhoto =
    artistInfo?.picture_xl || artistInfo?.picture_big || artist.image;

  // ── Albums : API en premier (vraies covers), sinon mockData
  const albums =
    apiAlbums.length > 0
      ? apiAlbums.slice(0, 8).map((a) => ({
          title: a.title,
          year: a.release_date ? a.release_date.slice(0, 4) : "",
          type:
            a.record_type === "single"
              ? "Single"
              : a.record_type === "ep"
                ? "EP"
                : "Album",
          cover: a.cover_medium || a.cover,
        }))
      : artist.albumsList || [];

  return (
    <div style={{ paddingBottom: "120px" }}>
      {/* ── Sticky header (appears after hero scrolls out) ─── */}
      <div className={`artist-sticky-header${stickyVisible ? " visible" : ""}`}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          {heroPhoto && (
            <img
              src={heroPhoto}
              alt={artist.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}
        </div>
        <span
          style={{
            fontSize: "15px",
            fontWeight: 800,
            color: "var(--text-primary)",
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {artist.name}
        </span>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            background: "rgba(162,56,255,0.1)",
            padding: "4px 10px",
            borderRadius: "var(--r-pill)",
            border: "1px solid var(--accent)",
          }}
        >
          <CheckIcon size={11} color="var(--accent)" strokeWidth={3} />
          <span
            style={{
              fontSize: "9px",
              fontWeight: 800,
              color: "var(--accent)",
              textTransform: "uppercase",
              letterSpacing: "0.8px",
            }}
          >
            Vérifié
          </span>
        </div>
      </div>

      {/* ── 1. Photo hero 40dvh ─────────────────────────────── */}
      <div
        ref={heroRef}
        style={{ position: "relative", height: "40dvh", overflow: "hidden" }}
      >
        {/* Fallback gradient toujours en dessous */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              artist.coverGradient || "linear-gradient(180deg,#1a1a2e,#4a1942)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: "64px",
              fontWeight: 800,
              color: "rgba(255,255,255,0.15)",
            }}
          >
            {artist.initials}
          </span>
        </div>
        {/* Photo API par-dessus */}
        {heroPhoto && (
          <img
            src={heroPhoto}
            alt={artist.name}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top",
            }}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        )}
        {/* Gradient overlay bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "60%",
            zIndex: 2,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.92) 0%, transparent 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Floating Back Button */}
        <button
          onClick={onBack}
          className="pressable"
          style={{
            position: "absolute",
            top: "16px",
            left: "16px",
            zIndex: 10,
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.45)",
            border: "1px solid rgba(255,255,255,0.15)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <ArrowLeft size={18} color="#fff" />
        </button>

        {/* Floating Play Button */}
        <button
          onClick={onOpenPlayer}
          className="pressable marker-champion"
          style={{
            position: "absolute",
            bottom: "16px",
            right: "24px",
            zIndex: 10,
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "var(--gradient-flow)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 16px rgba(162,56,255,0.4)",
          }}
        >
          <PlayIcon
            size={24}
            color="#fff"
            fill="#fff"
            style={{ marginLeft: "4px" }}
          />
        </button>
      </div>

      {/* ── 2. Nom + badge Pulse (Humain Vérifié) ──────────────── */}

      {/* ── 2. Nom + badge Pulse (Humain Vérifié) ──────────────── */}
      <div
        className="animate-stagger animate-delay-1"
        style={{ padding: "24px var(--page-h) 0" }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          <h1
            style={{
              fontSize: "34px",
              fontWeight: 900,
              color: "var(--text-primary)",
              letterSpacing: "-1px",
            }}
          >
            {artist.name}
          </h1>
        </div>

        {/* ── 3. Info line (Localisation mise en avant) ─────────── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            marginTop: "16px",
          }}
        >
          {artist.location && (
            <p
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: "var(--text-primary)",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              📍 {artist.location}
            </p>
          )}
          <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
            {artist.profession} • {artist.genre}
          </p>
        </div>

        {/* ── 4. Fans ────────────────────────────────────────── */}
        <p
          style={{
            fontSize: "14px",
            color: "var(--text-secondary)",
            marginTop: "12px",
          }}
        >
          <span style={{ fontWeight: 800, color: "var(--text-primary)" }}>
            {artistInfo?.nb_fan
              ? artistInfo.nb_fan.toLocaleString("fr-FR")
              : artist.listeners}
          </span>{" "}
          fans attendent la suite
        </p>

        {/* ── 5. Boutons Action ───────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            marginTop: "24px",
          }}
        >
          <button
            className="pressable"
            onClick={() => setLiked((v) => !v)}
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: liked
                ? "rgba(162, 56, 255, 0.15)"
                : "var(--bg-elevated)",
              border: `1px solid ${liked ? "var(--accent)" : "var(--border-default)"}`,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <HeartIcon
              size={22}
              color={liked ? "var(--accent)" : "var(--text-secondary)"}
              fill={liked ? "var(--accent)" : "none"}
              strokeWidth={2}
            />
          </button>
          <button
            className="pressable"
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-default)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ShareIcon
              size={22}
              color="var(--text-secondary)"
              strokeWidth={2}
            />
          </button>
        </div>
      </div>

      {/* ── 6. Univers Artiste — "Discover Weekly" card ─────── */}
      <div
        className="animate-stagger animate-delay-2"
        style={{
          padding: "0 var(--page-h)",
          marginTop: "32px",
          marginBottom: "8px",
        }}
      >
        <div
          onClick={onViewBio}
          className="pressable"
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: "18px",
            cursor: "pointer",
            background:
              "linear-gradient(135deg, #7B1FD4 0%, #A238FF 55%, #C260FF 100%)",
            boxShadow: "0 8px 32px rgba(162,56,255,0.35)",
            minHeight: 130,
            display: "flex",
            alignItems: "stretch",
          }}
        >
          {/* Left content */}
          <div
            style={{
              flex: 1,
              padding: "20px 0 20px 20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              zIndex: 2,
              minWidth: 0,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.65)",
                  textTransform: "uppercase",
                  letterSpacing: "1.2px",
                  marginBottom: "6px",
                }}
              >
                Univers de l'artiste
              </p>
              <p
                style={{
                  fontSize: "19px",
                  fontWeight: 900,
                  color: "#fff",
                  lineHeight: 1.2,
                  marginBottom: "4px",
                  fontVariationSettings: "'wdth' 75",
                }}
              >
                Découvrir l'univers
                <br />
                de {artist.name}
              </p>
              <p
                style={{
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.7)",
                  lineHeight: 1.4,
                  marginTop: "4px",
                }}
              >
                Démos, backstage et coulisses exclusives
              </p>
            </div>
            {/* Action row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                marginTop: "16px",
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewBio();
                }}
                className="pressable"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "rgba(0,0,0,0.35)",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <PlayIcon
                  size={18}
                  color="#fff"
                  fill="#fff"
                  style={{ marginLeft: "2px" }}
                />
              </button>
              <span style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "rgba(255,255,255,0.75)",
                letterSpacing: "0.2px",
              }}>
                Voir l'univers →
              </span>
            </div>
          </div>

          {/* Right — artist photo */}
          <div
            style={{
              width: 120,
              flexShrink: 0,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {heroPhoto && (
              <img
                src={heroPhoto}
                alt={artist.name}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "top",
                  opacity: 0.92,
                }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
            {/* fade left edge so photo blends into gradient */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to right, #9030e8 0%, transparent 40%)",
              }}
            />
          </div>
        </div>
      </div>

      {/* ── 8. Top titres ────────────────────────────────────── */}
      {topTracks.length > 0 && (
        <div
          className="animate-stagger animate-delay-3"
          style={{ padding: "48px var(--page-h) 0" }}
        >
          <SectionTitle>Top titres</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {topTracks.slice(0, 4).map((t, i) => (
              <div
                key={t.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  padding: "12px 0",
                  borderBottom:
                    i < 3 ? "1px solid var(--border-subtle)" : "none",
                }}
              >
                <span
                  style={{
                    width: 20,
                    fontSize: "14px",
                    color: "var(--text-tertiary)",
                    textAlign: "center",
                    fontWeight: 600,
                  }}
                >
                  {i + 1}
                </span>
                <img
                  src={t.cover}
                  alt={t.title}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "8px",
                    objectFit: "cover",
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: "15px",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {t.title}
                  </p>
                  <p
                    style={{ fontSize: "13px", color: "var(--text-secondary)" }}
                  >
                    {t.artistName || artist.name}
                  </p>
                </div>
                <button
                  onClick={onOpenPlayer}
                  className="pressable"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 4,
                  }}
                >
                  <PlayIcon size={18} color="var(--text-secondary)" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 9. Processus Créatif (Timeline) ── NOVEAUTÉ PULSE ──── */}
      <div
        className="animate-stagger animate-delay-4"
        style={{ padding: "48px 0 0" }}
      >
        <div style={{ padding: "0 var(--page-h)" }}>
          <SectionTitle moreLabel="Tout le feed">
            Dans les coulisses
          </SectionTitle>
        </div>
        <div
          className="hide-scrollbar"
          style={{
            display: "flex",
            gap: "16px",
            paddingLeft: "var(--page-h)",
            overflowX: "auto",
            paddingBottom: "8px",
          }}
        >
          {[
            {
              id: "p1",
              title: "Démo vocale - Quel type de vibe ?",
              type: "Audio",
              date: "Hier",
              color: "#ff5c8a",
            },
            {
              id: "p2",
              title: "Paroles manuscrites",
              type: "Note",
              date: "il y a 3j",
              color: "#a238ff",
            },
            {
              id: "p3",
              title: "Beat making session (Studio)",
              type: "Vidéo",
              date: "il y a 1 sem.",
              color: "#ff9a44",
            },
          ].map((item) => (
            <div
              key={item.id}
              className="pressable"
              style={{
                flexShrink: 0,
                width: 240,
                height: 160,
                borderRadius: "16px",
                background: "var(--bg-elevated)",
                border: `1px solid var(--border-default)`,
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  padding: "10px",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: item.color,
                    boxShadow: `0 0 10px ${item.color}`,
                  }}
                />
              </div>
              <div>
                <span
                  style={{
                    fontSize: "10px",
                    color: "var(--text-tertiary)",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  {item.type}
                </span>
                <p
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    marginTop: "8px",
                    lineHeight: "1.4",
                  }}
                >
                  {item.title}
                </p>
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>
                {item.date}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 10. Album le plus populaire ───────────────────────── */}
      {artist.popularAlbum && (
        <div style={{ padding: "48px var(--page-h) 0" }}>
          <SectionTitle>Album le plus populaire</SectionTitle>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "18px",
              background: "var(--bg-card)",
              borderRadius: "16px",
              border: "1px solid var(--border-subtle)",
              padding: "18px",
            }}
          >
            <img
              src={artist.popularAlbum.cover}
              alt={artist.popularAlbum.title}
              style={{
                width: 80,
                height: 80,
                borderRadius: "12px",
                objectFit: "cover",
              }}
            />
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontSize: "17px",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  marginBottom: "4px",
                }}
              >
                {artist.popularAlbum.title}
              </p>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                Album · {artist.popularAlbum.year} ·{" "}
                {artist.popularAlbum.tracks} titres
              </p>
            </div>
            <button
              onClick={onOpenPlayer}
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "var(--gradient-flow)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PlayIcon size={18} color="#fff" fill="#fff" />
            </button>
          </div>
        </div>
      )}

      {/* ── 11. Discographie ─────────────────────────────────── */}
      {albums.length > 0 && (
        <div style={{ padding: "48px 0 0" }}>
          <div style={{ padding: "0 var(--page-h)" }}>
            <SectionTitle>Discographie</SectionTitle>
          </div>
          <div
            className="snap-mandatory hide-scrollbar"
            style={{
              display: "flex",
              gap: "20px",
              paddingLeft: "var(--page-h)",
              overflowX: "auto",
              paddingBottom: "8px",
            }}
          >
            {albums.map((album, i) => (
              <div
                key={album.title + i}
                className="snap-center pressable"
                style={{ flexShrink: 0, width: 140 }}
              >
                <img
                  src={album.cover}
                  alt={album.title}
                  style={{
                    width: 140,
                    height: 140,
                    borderRadius: "12px",
                    objectFit: "cover",
                    marginBottom: "10px",
                  }}
                />
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {album.title}
                </p>
                <p style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>
                  {album.type} · {album.year}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 12. Biographie (Remontée) ── AXE HUMAIN ───────────── */}
      <div style={{ padding: "48px var(--page-h) 0" }}>
        <SectionTitle onMore={onViewBio} moreLabel="Tout savoir">
          Biographie
        </SectionTitle>
        <p
          style={{
            fontSize: "16px",
            color: "rgba(255,255,255,0.7)",
            lineHeight: 1.8,
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {artist.bio}
        </p>
      </div>

      {/* ── 13. Espace Fan (Q&A) ── NOVEAUTÉ PULSE ────────────── */}
      <div style={{ padding: "48px var(--page-h) 0" }}>
        <SectionTitle>Espace Fan</SectionTitle>
        <div
          style={{
            background: "var(--bg-elevated)",
            borderRadius: "20px",
            border: "1px solid var(--border-default)",
            padding: "24px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              color: "var(--accent)",
              fontWeight: 900,
              marginBottom: "10px",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
            }}
          >
            DERNIÈRE RÉPONSE
          </p>
          <p
            style={{
              fontSize: "18px",
              fontWeight: 800,
              color: "var(--text-primary)",
              marginBottom: "16px",
              lineHeight: 1.3,
            }}
          >
            "Est-ce qu'on aura une version longue de Bossa Nova ? 🙏"
          </p>
          <div
            style={{
              display: "flex",
              gap: "16px",
              alignItems: "flex-start",
              paddingTop: "20px",
              borderTop: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "#333",
                overflow: "hidden",
                flexShrink: 0,
                border: "1px solid var(--accent)",
              }}
            >
              <img
                src={heroPhoto}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.06)",
                padding: "16px",
                borderRadius: "0 16px 16px 16px",
                flex: 1,
              }}
            >
              <p
                style={{
                  fontSize: "15px",
                  color: "rgba(255,255,255,0.9)",
                  lineHeight: 1.6,
                }}
              >
                Je suis en train d'enregistrer le bridge justement ! Sortie
                prévue pour le prochain EP :) 🤫
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 14. Artistes similaires ───────────────────────────── */}
      <div style={{ padding: "48px 0 0" }}>
        <div style={{ padding: "0 var(--page-h)" }}>
          <SectionTitle>Artistes similaires</SectionTitle>
        </div>
        <div
          className="hide-scrollbar"
          style={{
            display: "flex",
            gap: "24px",
            paddingLeft: "var(--page-h)",
            overflowX: "auto",
            paddingBottom: "12px",
          }}
        >
          {relatedArtists.slice(0, 8).map((a) => (
            <div
              key={a.id}
              className="pressable"
              style={{
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: "50%",
                  background: "var(--bg-elevated)",
                  overflow: "hidden",
                  boxShadow: "0 6px 15px rgba(0,0,0,0.4)",
                }}
              >
                <img
                  src={a.picture_medium}
                  alt={a.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  textAlign: "center",
                }}
              >
                {a.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 15. Playlists ────────────────────────────────────── */}
      <div style={{ padding: "48px 0 0" }}>
        <div style={{ padding: "0 var(--page-h)" }}>
          <SectionTitle>Playlists</SectionTitle>
        </div>
        <div
          className="hide-scrollbar"
          style={{
            display: "flex",
            gap: "16px",
            paddingLeft: "var(--page-h)",
            overflowX: "auto",
            paddingBottom: "8px",
          }}
        >
          {apiPlaylists.map((pl) => (
            <div key={pl.id} style={{ flexShrink: 0, width: 160 }}>
              <div
                style={{
                  width: 160,
                  height: 160,
                  borderRadius: "16px",
                  overflow: "hidden",
                  marginBottom: "12px",
                  background: "var(--bg-elevated)",
                }}
              >
                <img
                  src={pl.picture_medium}
                  alt={pl.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {pl.title}
              </p>
              <p style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>
                {pl.nb_tracks} titres
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
