import { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { searchArtist } from '../../api/deezer.js';

function SectionTitle({ children }) {
  return (
    <h2 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px' }}>
      {children}
    </h2>
  );
}

/* ── Hook: fires once when element enters viewport ── */
function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        obs.disconnect(); // fire once only
      }
    }, { threshold: 0.15, ...options });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function KaraokeBio({ text }) {
  const words = text.split(/\s+/).filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const wordRefs = useRef([]);

  useEffect(() => {
    const scrollEl = containerRef.current?.closest('.scroll-area');
    if (!scrollEl) return;

    const threshold = window.innerHeight * 0.52;

    const handleScroll = () => {
      let next = 0;
      wordRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top < threshold) next = i + 1;
      });
      setActiveIndex(next);
    };

    scrollEl.addEventListener('scroll', handleScroll, { passive: true });
    return () => scrollEl.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ padding: '24px var(--page-h) 80px' }}
    >
      <p style={{ lineHeight: 1.45 }}>
        {words.map((word, i) => (
          <span
            key={i}
            ref={el => { wordRefs.current[i] = el; }}
            style={{
              fontSize: '38px',
              fontWeight: 800,
              fontVariationSettings: "'wdth' 78",
              letterSpacing: '-0.5px',
              color: i < activeIndex ? 'var(--text-primary)' : 'var(--text-tertiary)',
              opacity: i < activeIndex ? 1 : 0.25,
              transition: 'color 280ms ease, opacity 280ms ease',
              display: 'inline',
            }}
          >
            {word}{' '}
          </span>
        ))}
      </p>
    </div>
  );
}

/* ── Brand SVG icons ── */
const SOCIAL_ICONS = {
  Instagram: (color) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill={color} stroke="none" />
    </svg>
  ),
  TikTok: (color) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={color}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.17 8.17 0 0 0 4.78 1.53V6.77a4.85 4.85 0 0 1-1-.08z"/>
    </svg>
  ),
  YouTube: (color) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={color}>
      <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14C4.5 20.45 12 20.45 12 20.45s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z"/>
    </svg>
  ),
};

const SOCIAL_BRAND_COLORS = {
  Instagram: '#E1306C',
  TikTok:    '#ffffff',
  YouTube:   '#FF0000',
};

/* City poster images — user-supplied files in public/images/ */
const CITY_IMAGE = {
  'Bordeaux':  '/images/ville-de-Bordeaux.jpg',
  'Paris':     '/images/paris.jfif',
  "L'Olympia": "/images/l'olympia.jpg",
};

function ReseauxSection({ networks }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{ padding: '0 var(--page-h)', marginBottom: '36px' }}>
      <SectionTitle>Réseaux</SectionTitle>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {networks.map(({ label, handle }, i) => {
          const Icon = SOCIAL_ICONS[label];
          const brandColor = SOCIAL_BRAND_COLORS[label] || 'var(--text-secondary)';
          return (
            <div
              key={label}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                padding: '10px 18px',
                borderRadius: 'var(--r-pill)',
                border: '1px solid var(--border-default)',
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(12px)',
                cursor: 'pointer',
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.95)',
                transition: `opacity 380ms cubic-bezier(0.34,1.56,0.64,1) ${i * 90}ms,
                             transform 380ms cubic-bezier(0.34,1.56,0.64,1) ${i * 90}ms`,
              }}
              onPointerDown={e => { e.currentTarget.style.transform = 'scale(0.94)'; e.currentTarget.style.background = 'var(--bg-pressed)'; }}
              onPointerUp={e =>    { e.currentTarget.style.transform = 'scale(1)';    e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              onPointerLeave={e => { e.currentTarget.style.transform = 'scale(1)';    e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            >
              {Icon && Icon(brandColor)}
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                {handle}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LieuxSection({ places }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{ marginBottom: '32px' }}>
      <div style={{ padding: '0 var(--page-h)' }}>
        <SectionTitle>Lieux importants</SectionTitle>
      </div>
      <div style={{
        display: 'flex', gap: '14px', overflowX: 'auto', scrollbarWidth: 'none',
        paddingLeft: 'var(--page-h)', paddingRight: 'var(--page-h)',
        paddingBottom: '4px',
      }}>
        {places.map(({ name, role }, i) => {
          const imgUrl = CITY_IMAGE[name] || `https://picsum.photos/seed/${name.toLowerCase()}/300/480`;
          return (
            <div
              key={name}
              style={{
                flexShrink: 0,
                width: '160px',
                height: '220px',
                borderRadius: '18px',
                overflow: 'hidden',
                position: 'relative',
                cursor: 'pointer',
                border: '1px solid var(--border-subtle)',
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateX(0)' : 'translateX(48px)',
                transition: `opacity 440ms cubic-bezier(0.34,1.56,0.64,1) ${i * 140}ms,
                             transform 440ms cubic-bezier(0.34,1.56,0.64,1) ${i * 140}ms`,
              }}
              onPointerDown={e =>  e.currentTarget.style.transform = 'scale(0.96)'}
              onPointerUp={e =>    e.currentTarget.style.transform = 'scale(1)'}
              onPointerLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              {/* City photo */}
              <img
                src={imgUrl}
                alt={name}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {/* Heavy gradient overlay — transparent top → solid black bottom */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.55) 65%, #000 100%)',
              }} />
              {/* Text anchored to bottom */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '14px',
              }}>
                <p style={{
                  fontSize: '17px', fontWeight: 800,
                  color: '#fff', lineHeight: 1.2, marginBottom: '4px',
                  fontVariationSettings: "'wdth' 80",
                }}>
                  {name}
                </p>
                <p style={{
                  fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4,
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                  {role}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Block A: Un mot de l'artiste ── */
function VoiceNoteBlock({ data }) {
  const [ref, inView] = useInView();
  if (!data) return null;
  return (
    <div ref={ref} style={{
      padding: '0 var(--page-h)', marginBottom: '40px',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(32px)',
      transition: 'opacity 500ms ease, transform 500ms ease',
    }}>
      <SectionTitle>Un mot de l'artiste</SectionTitle>
      <div style={{
        background: 'rgba(162,56,255,0.08)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(162,56,255,0.25)',
        borderRadius: '20px',
        padding: '20px',
      }}>
        <p style={{
          fontSize: '16px', fontStyle: 'italic',
          color: 'rgba(255,255,255,0.85)', lineHeight: 1.6,
          marginBottom: '20px',
        }}>
          "{data.text}"
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button className="pressable" style={{
            width: 42, height: 42, borderRadius: '50%',
            background: 'var(--accent)', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0,
            boxShadow: '0 4px 14px rgba(162,56,255,0.4)',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', flex: 1, height: 28 }}>
            {Array.from({ length: 26 }).map((_, i) => (
              <div key={i} className="waveform-bar" style={{
                width: '3px', borderRadius: '2px',
                background: 'var(--accent)', opacity: 0.65,
                animationDelay: `${i * 55}ms`,
              }} />
            ))}
          </div>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)', flexShrink: 0 }}>
            {data.duration}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Block B: Backstage des créations ── */
function BackstageCarouselBlock({ creations }) {
  const [ref, inView] = useInView();
  if (!creations?.length) return null;
  return (
    <div ref={ref} style={{
      marginBottom: '40px',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(32px)',
      transition: 'opacity 500ms ease 100ms, transform 500ms ease 100ms',
    }}>
      <div style={{ padding: '0 var(--page-h)' }}>
        <SectionTitle>Backstage des créations</SectionTitle>
      </div>
      <div className="hide-scrollbar" style={{
        display: 'flex', gap: '14px',
        paddingLeft: 'var(--page-h)', overflowX: 'auto', paddingBottom: '4px',
      }}>
        {creations.map((c) => (
          <div key={c.id} className="pressable" style={{
            flexShrink: 0, width: 164, height: 164,
            borderRadius: '16px', overflow: 'hidden',
            position: 'relative', cursor: 'pointer',
            border: '1px solid var(--border-subtle)',
          }}>
            {c.cover && (
              <img src={c.cover} alt={c.title} style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%', objectFit: 'cover',
              }} />
            )}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.42)' }} />
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -65%)',
              width: 44, height: 44, borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </div>
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 100%)',
              padding: '10px 12px',
            }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>{c.title}</p>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>{c.type}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Block C: Inspirations — Bento redesign ── */
function InspirationsBlock({ inspirations, universeTags }) {
  const [ref, inView] = useInView();
  const [photos, setPhotos] = useState({});

  // Fetch real Deezer artist photos for each inspiration
  useEffect(() => {
    if (!inspirations?.length) return;
    inspirations.forEach(insp => {
      searchArtist(insp.name)
        .then(result => {
          const photo = result?.picture_medium || result?.picture_small || '';
          if (photo) setPhotos(prev => ({ ...prev, [insp.name]: photo }));
        })
        .catch(() => {}); // fail silently — card falls back to gradient
    });
  }, [inspirations]);

  if (!inspirations?.length) return null;
  const tags = universeTags || [];

  return (
    <div ref={ref} style={{
      padding: '0 var(--page-h)', marginBottom: '40px',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(32px)',
      transition: 'opacity 500ms ease 200ms, transform 500ms ease 200ms',
    }}>
      <SectionTitle>Inspirations</SectionTitle>

      {/* ── 1. Mood tags — horizontal scroll pills ── */}
      {tags.length > 0 && (
        <div
          className="hide-scrollbar"
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '4px',
            marginBottom: '16px',
          }}
        >
          {tags.map(tag => (
            <div
              key={tag}
              style={{
                flexShrink: 0,
                background: 'var(--bg-elevated)',
                border: '1px solid var(--accent)',
                borderRadius: 'var(--r-pill)',
                padding: '7px 16px',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--accent)',
                whiteSpace: 'nowrap',
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      )}

      {/* ── 2. Artist bento grid — 2 columns, image + name combined ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 'var(--item-gap)',
          width: '100%',
        }}
      >
        {inspirations.map(insp => {
          const photo = photos[insp.name];
          const hue = insp.name.charCodeAt(0) * 47 % 360;
          const fallbackBg = `linear-gradient(135deg, hsl(${hue},40%,12%), hsl(${(hue + 70) % 360},50%,22%))`;

          return (
            <div
              key={insp.name}
              style={{
                aspectRatio: '1 / 1.1',
                borderRadius: 'var(--r-card-lg)',
                overflow: 'hidden',
                position: 'relative',
                background: photo ? `url(${photo}) center/cover no-repeat` : fallbackBg,
                cursor: 'default',
              }}
            >
              {/* Deeper gradient overlay for better readability and a solid "frame" feeling at the bottom */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.85) 75%, #000 100%)',
                }}
              />

              {/* Artist name + role anchored to bottom-left */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                }}
              >
                <p style={{
                  fontSize: '15px',
                  fontWeight: 800,
                  color: '#fff',
                  lineHeight: 1.2,
                  marginBottom: '2px',
                  fontVariationSettings: "'wdth' 80",
                }}>
                  {insp.name}
                </p>
                <p style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'var(--accent)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  {insp.type}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Block D: Q & A accordion ── */
function QAndABlock({ qAndA }) {
  const [ref, inView] = useInView();
  const [openIndex, setOpenIndex] = useState(null);
  if (!qAndA?.length) return null;
  return (
    <div ref={ref} style={{
      padding: '0 var(--page-h)', marginBottom: '40px',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(32px)',
      transition: 'opacity 500ms ease 300ms, transform 500ms ease 300ms',
    }}>
      <h2 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px' }}>
        Q &amp; A
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {qAndA.map(({ q, a }, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i} style={{
              background: 'var(--bg-elevated)',
              border: `1px solid ${isOpen ? 'var(--accent)' : 'var(--border-default)'}`,
              borderRadius: '14px',
              overflow: 'hidden',
              transition: 'border-color 250ms ease',
            }}>
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', gap: '12px',
                  padding: '18px', background: 'none', border: 'none',
                  cursor: 'pointer', textAlign: 'left',
                }}
              >
                <span style={{
                  fontSize: '15px', fontWeight: 700,
                  color: 'var(--text-primary)', lineHeight: 1.3,
                }}>{q}</span>
                {/* SVG Plus icon — rotates 45° to become × when open */}
                <svg
                  width="18" height="18" viewBox="0 0 18 18" fill="none"
                  aria-hidden="true"
                  style={{
                    flexShrink: 0,
                    color: 'var(--accent)',
                    transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                    transition: 'transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                >
                  <line x1="9" y1="2" x2="9" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="2" y1="9" x2="16" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              {/* CSS Grid height animation — smooth, no fixed maxHeight */}
              <div style={{
                display: 'grid',
                gridTemplateRows: isOpen ? '1fr' : '0fr',
                transition: 'grid-template-rows 350ms cubic-bezier(0.4, 0, 0.2, 1)',
              }}>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                  }}>
                    <p style={{
                      padding: '14px 18px 18px',
                      fontSize: '14px',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.7,
                    }}>{a}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function BioView({ artist, onBack }) {
  // Scroll to top on mount
  useEffect(() => {
    const scrollEl = document.querySelector('.scroll-area');
    if (scrollEl) scrollEl.scrollTop = 0;
  }, []);

  return (
    <div style={{ paddingBottom: '48px' }}>

      {/* Background Hero Blur */}
      {artist.image && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '280px',
          backgroundImage: `url(${artist.image})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'blur(40px) saturate(1.8)', opacity: 0.2,
          maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
          pointerEvents: 'none', zIndex: 0,
        }} />
      )}

      {/* Sticky Glass Header */}
      <div className="glass-sheet" style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '16px var(--page-h)', borderBottom: '1px solid rgba(255,255,255,0.05)',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <button onClick={onBack} className="pressable"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 0 }}>
          <ArrowLeft size={22} color="var(--text-primary)" />
        </button>
        <h1 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)' }}>Univers</h1>
      </div>

      {/* Intro Quote */}
      <div
        className="animate-stagger animate-delay-1"
        style={{ padding: '28px var(--page-h) 0', position: 'relative', zIndex: 1 }}
      >
        <p style={{
          fontSize: '26px', fontStyle: 'italic', fontWeight: 700,
          color: 'var(--text-primary)', lineHeight: 1.5,
          borderLeft: '3px solid var(--accent)', paddingLeft: '18px',
          fontVariationSettings: "'wdth' 85",
        }}>
          "{artist.name}, une voix incontournable de sa génération."
        </p>
      </div>

      {/* ── Karaoke Bio ── */}
      <KaraokeBio text={artist.bio || ''} />

      {/* ── Secondary content scrolls in after bio ── */}
      <div style={{ position: 'relative', zIndex: 1, paddingBottom: '16px' }}>

        {/* Réseaux — staggered slide-up */}
        {artist.socialNetworks && <ReseauxSection networks={artist.socialNetworks} />}

        {/* Lieux importants — staggered slide-in from right */}
        {artist.importantPlaces && <LieuxSection places={artist.importantPlaces} />}

        {/* ── Pulse Blocks ── */}
        <VoiceNoteBlock data={artist.wordFromArtist} />
        <BackstageCarouselBlock creations={artist.backstageCreations} />
        <InspirationsBlock
          inspirations={artist.inspirations}
          universeTags={artist.universeTags}
        />
        <QAndABlock qAndA={artist.qAndA} />

      </div>
    </div>
  );
}
