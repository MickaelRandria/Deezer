/**
 * DeezerIcons — Pictogrammes officiels Deezer (line-art blanc)
 * Style : stroke="currentColor", fill="none", strokeWidth={1.8}, strokeLinecap="round", strokeLinejoin="round"
 */

const S = { stroke: 'currentColor', fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };

// ── MOODS ─────────────────────────────────────────────────────

export function GoodVibesIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Visage souriant */}
      <circle cx="12" cy="12" r="9" {...S} />
      <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="10" r="1" fill="currentColor" stroke="none" />
      <path d="M8.5 14.5 C9.5 16.5 14.5 16.5 15.5 14.5" {...S} />
    </svg>
  );
}

export function LoveIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Cœur */}
      <path d="M12 20.5 C12 20.5 3 14 3 8.5 C3 5.5 5.5 3 8.5 3 C10 3 11.2 3.7 12 4.8 C12.8 3.7 14 3 15.5 3 C18.5 3 21 5.5 21 8.5 C21 14 12 20.5 12 20.5Z" {...S} />
      {/* Nœud/ruban */}
      <path d="M9 6.5 C9 6.5 10.5 5 12 6.5 C13.5 5 15 6.5 15 6.5" {...S} />
    </svg>
  );
}

export function MotivationIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Basket / sneaker */}
      <path d="M3 16 L3 13 C3 13 5 11 8 11.5 L14 13 C16 13.5 19 13 21 14.5 L21 16 C21 17 20 17.5 19 17.5 L5 17.5 C4 17.5 3 17 3 16Z" {...S} />
      {/* Languette */}
      <path d="M8 11.5 L9 8 L12 8.5 L11 11.8" {...S} />
      {/* Lacets */}
      <path d="M9.5 13.5 L13 14" {...S} strokeWidth={1.2} />
      <path d="M9 14.5 L12.5 15" {...S} strokeWidth={1.2} />
      {/* Semelle */}
      <path d="M4 17.5 C4 18.3 5 19 6.5 19 L18 19 C19.5 19 21 18.5 21 17.5" {...S} />
    </svg>
  );
}

export function ChillIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Tronc palmier */}
      <path d="M12 20 C12 20 11 14 12 10 C13 6 12 4 12 4" {...S} />
      {/* Feuilles */}
      <path d="M12 8 C12 8 8 6 6 8 C8 9 11 9 12 10" {...S} />
      <path d="M12 8 C12 8 16 6 18 8 C16 9 13 9 12 10" {...S} />
      <path d="M12 6 C12 6 9 3.5 11 2 C12 3 12.5 5 12 8" {...S} />
      <path d="M12 6 C12 6 15 3.5 13 2 C12 3 11.5 5 12 8" {...S} />
      {/* Sol */}
      <path d="M9 20 L15 20" {...S} />
    </svg>
  );
}

export function TristesseIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Visage triste */}
      <circle cx="12" cy="12" r="9" {...S} />
      <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="10" r="1" fill="currentColor" stroke="none" />
      {/* Bouche triste */}
      <path d="M8.5 16 C9.5 14 14.5 14 15.5 16" {...S} />
      {/* Larme */}
      <path d="M9 11.5 L8.5 13.5 C8.5 14.2 9.5 14.2 9.5 13.5 L9 11.5Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FocusIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Fleur de lotus */}
      <path d="M12 19 C12 19 7 16 7 11 C7 8 9.5 7 12 9 C14.5 7 17 8 17 11 C17 16 12 19 12 19Z" {...S} />
      <path d="M12 19 C12 19 9 17 8 13 C10 14 12 15 12 19Z" {...S} />
      <path d="M12 19 C12 19 15 17 16 13 C14 14 12 15 12 19Z" {...S} />
      {/* Tige */}
      <path d="M12 19 L12 22" {...S} />
      {/* Feuilles */}
      <path d="M12 21 C12 21 9 20 8 22" {...S} />
      <path d="M12 21 C12 21 15 20 16 22" {...S} />
    </svg>
  );
}

export function SoireeIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Cotillon */}
      <path d="M4 20 L10 10" {...S} strokeWidth={2} />
      <path d="M10 10 C10 10 14 8 16 10 C18 12 15 14 10 10Z" {...S} />
      {/* Confettis */}
      <circle cx="16" cy="5" r="1" fill="currentColor" stroke="none" />
      <circle cx="19" cy="8" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="20" cy="12" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="14" cy="4" r="0.6" fill="currentColor" stroke="none" />
      <path d="M17 7 L18 6" {...S} strokeWidth={1.5} />
      <path d="M19 10 L20 9" {...S} strokeWidth={1.5} />
    </svg>
  );
}

export function DecouverteIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Baguette magique */}
      <path d="M3 21 L14 10" {...S} strokeWidth={2} />
      <path d="M14 10 L16 8" {...S} strokeWidth={2.5} />
      {/* Étoiles */}
      <path d="M18 4 L18.5 6 L20.5 6 L19 7.5 L19.5 9.5 L18 8 L16.5 9.5 L17 7.5 L15.5 6 L17.5 6 Z" fill="currentColor" stroke="none" />
      <path d="M20 12 L20.3 13 L21.3 13 L20.5 13.7 L20.8 14.7 L20 14 L19.2 14.7 L19.5 13.7 L18.7 13 L19.7 13 Z" fill="currentColor" stroke="none" />
      <path d="M14 2 L14.2 2.8 L15 2.8 L14.4 3.3 L14.6 4.1 L14 3.6 L13.4 4.1 L13.6 3.3 L13 2.8 L13.8 2.8 Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function BibliothequeIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Cœur avec notes musicales */}
      <path d="M12 18 C12 18 4 12 4 7.5 C4 5.5 5.8 4 8 4 C9.5 4 10.8 4.8 12 6 C13.2 4.8 14.5 4 16 4 C18.2 4 20 5.5 20 7.5 C20 12 12 18 12 18Z" {...S} />
      {/* Petite note */}
      <path d="M10 9 L10 12 M10 12 C10 12.6 9 12.6 9 12 C9 11.4 10 11.4 10 12" {...S} strokeWidth={1.3} />
      <path d="M13 8 L13 11 M13 11 C13 11.6 12 11.6 12 11 C12 10.4 13 10.4 13 11" {...S} strokeWidth={1.3} />
      <path d="M10 9 L13 8" {...S} strokeWidth={1.3} />
    </svg>
  );
}

// ── GENRES ────────────────────────────────────────────────────

export function RapIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Boombox */}
      <rect x="2" y="8" width="20" height="12" rx="2" {...S} />
      {/* Haut-parleurs */}
      <circle cx="7" cy="14" r="3" {...S} />
      <circle cx="7" cy="14" r="1.5" {...S} />
      <circle cx="17" cy="14" r="3" {...S} />
      <circle cx="17" cy="14" r="1.5" {...S} />
      {/* Boutons centraux */}
      <rect x="10.5" y="10" width="3" height="1.5" rx="0.5" {...S} />
      <rect x="10.5" y="12.5" width="3" height="1.5" rx="0.5" {...S} />
      {/* Antenne */}
      <path d="M8 8 L10 4" {...S} />
      <path d="M16 8 L14 4" {...S} />
      {/* Poignée */}
      <path d="M8 8 L16 8" {...S} />
    </svg>
  );
}

export function PopIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Micro */}
      <rect x="9" y="2" width="6" height="10" rx="3" {...S} />
      {/* Corps du micro */}
      <path d="M5 10 C5 14.4 7.6 17 12 17 C16.4 17 19 14.4 19 10" {...S} />
      {/* Tige */}
      <path d="M12 17 L12 21" {...S} />
      <path d="M9 21 L15 21" {...S} />
      {/* Grille micro */}
      <path d="M9 6 L15 6" {...S} strokeWidth={1.2} />
      <path d="M9 8 L15 8" {...S} strokeWidth={1.2} />
    </svg>
  );
}

export function RnBIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Diamant */}
      <path d="M12 3 L20 10 L12 21 L4 10 Z" {...S} />
      <path d="M4 10 L12 3 L20 10" {...S} />
      <path d="M8 10 L12 3 L16 10" {...S} />
      <path d="M4 10 L8 10 L12 21" {...S} />
      <path d="M20 10 L16 10 L12 21" {...S} />
      <path d="M8 10 L16 10" {...S} />
    </svg>
  );
}

export function RockIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Guitare électrique */}
      {/* Corps */}
      <path d="M8 14 C6 13 5 11.5 6 10 C7 8.5 8.5 8.5 9 9.5 C9.5 8 11 7.5 12.5 8 C14 8.5 14.5 10 13.5 11 C15 11.5 15 13.5 13.5 14 C12.5 15 10.5 15.5 9.5 15 Z" {...S} />
      {/* Manche */}
      <path d="M13 9 L19 3" {...S} strokeWidth={2} />
      {/* Mécaniques */}
      <circle cx="19.5" cy="2.5" r="1" {...S} />
      <circle cx="21" cy="4" r="1" {...S} />
      {/* Corde */}
      <path d="M9.5 15 L9 19 M9 19 C9 19.6 8 19.6 8 19 C8 18.4 9 18.4 9 19" {...S} strokeWidth={1.2} />
    </svg>
  );
}

export function DanceEdmIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Silhouette danseur */}
      <circle cx="12" cy="4" r="2" {...S} />
      {/* Corps */}
      <path d="M12 6 L12 13" {...S} />
      {/* Bras gauche levé */}
      <path d="M12 8 L7 5" {...S} />
      {/* Bras droit */}
      <path d="M12 8 L16 11" {...S} />
      {/* Jambe gauche */}
      <path d="M12 13 L8 18" {...S} />
      {/* Jambe droite écartée */}
      <path d="M12 13 L15 19" {...S} />
      {/* Petites étoiles EDM */}
      <circle cx="6" cy="4" r="0.7" fill="currentColor" stroke="none" />
      <circle cx="18" cy="7" r="0.7" fill="currentColor" stroke="none" />
      <circle cx="19" cy="14" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function MusiqueLatineIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Guitare acoustique */}
      {/* Corps inférieur */}
      <path d="M9 13 C7 13 5.5 14.5 5.5 16.5 C5.5 18.5 7 20 9 20 C10.5 20 11.8 19.2 12.5 18 C13.2 19.2 14.5 20 16 20 C18 20 19.5 18.5 19.5 16.5 C19.5 14.5 18 13 16 13 C14.5 13 13.2 13.8 12.5 15 C11.8 13.8 10.5 13 9 13Z" {...S} />
      {/* Trou de la caisse */}
      <circle cx="12.5" cy="16.5" r="2" {...S} />
      {/* Manche */}
      <path d="M12.5 13 L12.5 4" {...S} strokeWidth={2} />
      {/* Tête */}
      <rect x="11" y="2" width="3" height="3" rx="0.5" {...S} />
      {/* Cordes */}
      <path d="M11.5 4.5 L11.5 13" {...S} strokeWidth={0.8} />
      <path d="M13.5 4.5 L13.5 13" {...S} strokeWidth={0.8} />
    </svg>
  );
}

// ── Export maps ───────────────────────────────────────────────

export const MOOD_ICONS = {
  goodVibes:    GoodVibesIcon,
  love:         LoveIcon,
  motivation:   MotivationIcon,
  chill:        ChillIcon,
  tristesse:    TristesseIcon,
  focus:        FocusIcon,
  soiree:       SoireeIcon,
  decouverte:   DecouverteIcon,
  bibliotheque: BibliothequeIcon,
};

export const GENRE_ICONS = {
  rap:           RapIcon,
  rapFrancais:   RapIcon,
  pop:           PopIcon,
  rnb:           RnBIcon,
  rock:          RockIcon,
  danceEdm:      DanceEdmIcon,
  musiqueLatine: MusiqueLatineIcon,
};
