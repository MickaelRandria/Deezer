import { useState } from 'react';
import { X, MapPin, Calendar, Clock, Heart, ChevronRight, Zap, Flame, Tag } from 'lucide-react';
import { TYPE_LABELS } from '../../data/mapData.js';

export default function EventSheet({ event, onClose, onOpenArtist }) {
  const [liked, setLiked] = useState(false);

  const visible = !!event;

  if (!event) {
    return (
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, transform: 'translateY(100%)', transition: 'transform 350ms cubic-bezier(0.4,0,0.2,1)', zIndex: 1000 }} />
    );
  }

  const isFree    = event.status === 'free' || event.price === 0;
  const isSoldOut = event.status === 'sold_out';
  const isLow     = event.remainingTickets < 30 && !isSoldOut && !isFree;
  const isHot     = event.isHot && event.likes > 100;

  const dateObj = new Date(event.date);
  const dateStr = dateObj.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: 'var(--bg-card)',
      borderRadius: '16px 16px 0 0',
      border: '1px solid var(--border-subtle)',
      borderBottom: 'none',
      zIndex: 1000,
      transform: visible ? 'translateY(0)' : 'translateY(100%)',
      transition: 'transform 350ms cubic-bezier(0.4, 0, 0.2, 1)',
      maxHeight: '70%',
      overflowY: 'auto',
    }}>

      {/* Handle */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border-strong)' }} />
      </div>

      {/* Header : image + titre + close */}
      <div style={{ display: 'flex', gap: '12px', padding: '8px 16px 14px', alignItems: 'flex-start' }}>
        <div style={{ width: 72, height: 72, borderRadius: 'var(--r-card)', overflow: 'hidden', background: 'var(--bg-elevated)', flexShrink: 0 }}>
          {event.image
            ? <img src={event.image} alt={event.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <VenueGradient name={event.venue.name} />
          }
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: '4px' }}>{event.name}</p>
          <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: 'var(--r-pill)', background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
            {TYPE_LABELS[event.type] || event.type}
          </span>
        </div>
        <button onClick={onClose} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <X size={14} color="var(--text-secondary)" />
        </button>
      </div>

      {/* Séparateur */}
      <div style={{ height: 1, background: 'var(--border-subtle)', margin: '0 16px' }} />

      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

        {/* Lieu + date + heure */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={14} color="var(--text-tertiary)" strokeWidth={2} />
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{event.venue.name} · <span style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>{event.venue.address}</span></span>
          </div>
          <div style={{ display: 'flex', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={13} color="var(--text-tertiary)" strokeWidth={2} />
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{dateStr}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={13} color="var(--text-tertiary)" strokeWidth={2} />
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{event.time}</span>
            </div>
          </div>
        </div>

        {/* Artistes */}
        <div>
          <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Artiste{event.artists.length > 1 ? 's' : ''}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {event.artists.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-elevated)', borderRadius: 'var(--r-card)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: `hsl(${(a.name.charCodeAt(0) * 47) % 360},60%,30%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, color: '#fff' }}>{a.name[0]}</div>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{a.name}</p>
                    {event.isEmerging && (
                      <span style={{ fontSize: '10px', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '1px' }}>
                        <Tag size={9} /> à découvrir
                      </span>
                    )}
                  </div>
                </div>
                {a.mockId && (
                  <button onClick={() => { onClose(); onOpenArtist(a.mockId); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '12px' }}>
                    Voir le profil <ChevronRight size={13} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Prix + statut */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {isSoldOut && (
              <span style={{ fontSize: '15px', fontWeight: 700, padding: '4px 12px', borderRadius: 'var(--r-pill)', background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>Sold Out</span>
            )}
            {isFree && (
              <span style={{ fontSize: '15px', fontWeight: 700, padding: '4px 12px', borderRadius: 'var(--r-pill)', background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}>Gratuit</span>
            )}
            {!isFree && !isSoldOut && (
              <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>{event.price}€</span>
            )}
            {isHot && !isSoldOut && (
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Zap size={12} fill="#ef4444" /> ça part vite
              </span>
            )}
          </div>
          {isLow && (
            <p style={{ fontSize: '12px', color: '#f97316', fontWeight: 500 }}>
              Plus que {event.remainingTickets} places restantes
            </p>
          )}
          {isHot && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Flame size={13} color="#ef4444" fill="#ef4444" />
              <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{event.likes} personnes intéressées</span>
            </div>
          )}
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '8px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              disabled={isSoldOut}
              onClick={() => {}}
              style={{
                flex: 1, padding: '14px',
                background: isSoldOut ? 'var(--bg-elevated)' : 'var(--gradient-flow)',
                border: 'none', borderRadius: 'var(--r-card)',
                color: isSoldOut ? 'var(--text-tertiary)' : '#fff',
                fontSize: '14px', fontWeight: 700, cursor: isSoldOut ? 'not-allowed' : 'pointer',
                opacity: isSoldOut ? 0.5 : 1,
              }}
            >
              {isSoldOut ? 'Complet' : isFree ? 'Réserver ma place' : 'Prendre un billet'}
            </button>
            <button onClick={() => setLiked(v => !v)} style={{
              width: 48, height: 48, borderRadius: 'var(--r-card)',
              background: liked ? 'var(--accent-alpha)' : 'var(--bg-elevated)',
              border: `1px solid ${liked ? 'var(--accent)' : 'var(--border-default)'}`,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Heart size={18} color={liked ? 'var(--accent)' : 'var(--text-secondary)'} fill={liked ? 'var(--accent)' : 'none'} />
            </button>
          </div>
          <button
            onClick={() => {}}
            style={{
              width: '100%', padding: '13px',
              background: 'transparent', border: '1px solid var(--border-default)',
              borderRadius: 'var(--r-card)', color: 'var(--text-primary)',
              fontSize: '14px', fontWeight: 600, cursor: 'pointer',
            }}
          >
            {event.artists.length > 1 ? 'Écouter les artistes' : `Écouter ${event.artists[0].name}`}
          </button>
        </div>

      </div>
    </div>
  );
}

function VenueGradient({ name }) {
  const hue = name.charCodeAt(0) * 47 % 360;
  return (
    <div style={{
      width: '100%', height: '100%',
      background: `linear-gradient(135deg, hsl(${hue},60%,20%), hsl(${(hue+50)%360},70%,40%))`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '24px', fontWeight: 800, color: 'rgba(255,255,255,0.4)',
    }}>{name[0]}</div>
  );
}
