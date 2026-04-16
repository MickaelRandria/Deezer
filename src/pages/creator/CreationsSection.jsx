import { useState } from 'react';
import { Plus, Play, MoreHorizontal, Music, Layers, Mic, Image } from 'lucide-react';

const PROJECTS = [
  {
    id: 1, title: 'ÉCLATS', type: 'Album', year: 2024, tracks: 10,
    gradient: 'linear-gradient(135deg, #1a0533, #6b21a8)',
    initial: 'É',
  },
  {
    id: 2, title: 'NUITS ROUGES', type: 'EP', year: 2023, tracks: 6,
    gradient: 'linear-gradient(135deg, #450a0a, #991b1b)',
    initial: 'N',
  },
  {
    id: 3, title: 'Fragments', type: 'Projet', year: 2023, tracks: null,
    gradient: 'linear-gradient(135deg, #0f172a, #1e3a5f)',
    initial: 'F',
  },
  {
    id: 4, title: 'Lueurs (demo)', type: 'Son', year: 2022, tracks: 1,
    gradient: 'linear-gradient(135deg, #1a1a2e, #2d2d44)',
    initial: 'L',
  },
];

const TYPE_ICON = { Album: Layers, EP: Layers, Son: Music, Projet: Image };
const FILTERS = ['Tous', 'Albums', 'Sons', 'Projets'];

export default function CreationsSection() {
  const [filter, setFilter] = useState('Tous');
  const [hovered, setHovered] = useState(null);

  const filtered = filter === 'Tous'
    ? PROJECTS
    : PROJECTS.filter(p =>
        filter === 'Albums' ? (p.type === 'Album' || p.type === 'EP') :
        filter === 'Sons'   ? p.type === 'Son' :
        p.type === 'Projet'
      );

  return (
    <div style={{ padding: '32px 40px' }}>

      {/* ── Header ──────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Mes créations
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            {PROJECTS.length} projets · dernière mise à jour il y a 2h
          </p>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: '7px',
          padding: '10px 18px', borderRadius: 'var(--r-pill)',
          background: 'var(--gradient-flow)', border: 'none', cursor: 'pointer',
          color: '#fff', fontSize: '13px', fontWeight: 700,
        }}>
          <Plus size={15} strokeWidth={2.5} />
          Nouveau
        </button>
      </div>

      {/* ── Filtres ─────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {FILTERS.map(f => {
          const active = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '7px 16px', borderRadius: 'var(--r-pill)',
                border: active ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
                background: active ? 'var(--accent-alpha)' : 'transparent',
                color: active ? 'var(--accent)' : 'var(--text-secondary)',
                fontSize: '13px', fontWeight: active ? 600 : 400,
                cursor: 'pointer', transition: 'all var(--t-fast)',
              }}
            >{f}</button>
          );
        })}
      </div>

      {/* ── Liste des projets ────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {filtered.map((project) => {
          const TypeIcon = TYPE_ICON[project.type] || Music;
          const isHovered = hovered === project.id;
          return (
            <div
              key={project.id}
              onMouseEnter={() => setHovered(project.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '12px 16px', borderRadius: 'var(--r-card)',
                background: isHovered ? 'var(--bg-elevated)' : 'transparent',
                transition: 'background var(--t-fast)', cursor: 'pointer',
              }}
            >
              {/* Cover */}
              <div style={{
                width: 56, height: 56, borderRadius: 'var(--r-card)',
                background: project.gradient, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '20px', fontWeight: 800, color: 'rgba(255,255,255,0.9)',
              }}>
                {project.initial}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {project.title}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <TypeIcon size={12} color="var(--text-tertiary)" strokeWidth={2} />
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {project.type} · {project.year}
                    {project.tracks ? ` · ${project.tracks} titre${project.tracks > 1 ? 's' : ''}` : ''}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: isHovered ? 1 : 0, transition: 'opacity var(--t-fast)' }}>
                <button style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: 'var(--gradient-flow)', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Play size={13} color="#fff" fill="#fff" />
                </button>
                <button style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: 'var(--bg-pressed)', border: '1px solid var(--border-subtle)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <MoreHorizontal size={16} color="var(--text-secondary)" />
                </button>
              </div>

              {/* Actions toujours visible (···) */}
              <button
                onClick={e => e.stopPropagation()}
                style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: isHovered ? 0 : 1, transition: 'opacity var(--t-fast)',
                  position: 'absolute',
                }}
              >
                <MoreHorizontal size={16} color="var(--text-tertiary)" />
              </button>
            </div>
          );
        })}
      </div>

      {/* ── Voir tous ────────────────────────────────────────────── */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button style={{
          padding: '10px 24px', borderRadius: 'var(--r-pill)',
          background: 'transparent', border: '1px solid var(--border-default)', cursor: 'pointer',
          color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500,
          transition: 'border-color var(--t-fast), color var(--t-fast)',
        }}>
          Voir tous les projets
        </button>
      </div>
    </div>
  );
}
