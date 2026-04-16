export default function PlaceholderSection({ icon: Icon, title, description }) {
  return (
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '48px',
    }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
        textAlign: 'center', maxWidth: 360,
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'var(--accent-alpha)',
          border: '1px solid rgba(162,56,255,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={30} color="var(--accent)" strokeWidth={1.6} />
        </div>
        <div>
          <p style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            {title}
          </p>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {description || 'Cette section arrive bientôt dans le Backstage Deezer.'}
          </p>
        </div>
        <span style={{
          fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
          color: 'var(--accent)', background: 'var(--accent-alpha)',
          border: '1px solid rgba(162,56,255,0.3)',
          padding: '4px 12px', borderRadius: 'var(--r-pill)',
        }}>
          Bientôt disponible
        </span>
      </div>
    </div>
  );
}
