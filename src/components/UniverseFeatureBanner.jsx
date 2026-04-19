export default function UniverseFeatureBanner({ onOpenArtist }) {
  const AUPINARD_ID = 152058642;

  return (
    <div style={{
      margin: '0 var(--page-h) 32px',
      borderRadius: '20px',
      border: '2px solid #000',
      background: '#FFCC00',
      height: '140px',
      display: 'flex',
      overflow: 'hidden',
      position: 'relative',
      flexShrink: 0,
    }}>

      {/* ── Left column — bottom-anchored text ── */}
      <div style={{
        position: 'absolute',
        bottom: 16, left: 18,
        display: 'flex', flexDirection: 'column',
        alignItems: 'flex-start', gap: '5px',
      }}>
        <span style={{
          fontSize: '10px', fontWeight: 600,
          color: 'rgba(0,0,0,0.5)',
          letterSpacing: '0.04em',
        }}>
          Nouveau · Fonctionnalité
        </span>

        <h2 style={{
          margin: 0,
          fontSize: '20px', fontWeight: 900,
          color: '#000', letterSpacing: '-0.5px',
          lineHeight: 1.1,
        }}>
          Plonge dans<br />leur Univers
        </h2>

        <button
          onClick={() => onOpenArtist?.(AUPINARD_ID)}
          style={{
            marginTop: '2px',
            padding: '6px 14px',
            borderRadius: '100px',
            background: '#000', border: 'none',
            cursor: 'pointer',
            color: '#fff', fontSize: '11px', fontWeight: 800,
            letterSpacing: '0.01em',
          }}
        >
          Tester
        </button>
      </div>

      {/* ── Right column — doodle illustration ── */}
      <img
        src="/images/avatars-illustration.png"
        alt=""
        style={{
          position: 'absolute',
          bottom: 0, right: -10,
          height: '135px',
          width: 'auto',
          objectFit: 'contain',
          objectPosition: 'bottom right',
          display: 'block',
        }}
      />
    </div>
  );
}
