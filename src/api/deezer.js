// ============================================================
// Deezer Public API — pas d'auth requise pour la lecture
// Le proxy Vite (/deezer-api → https://api.deezer.com) contourne le CORS
// ============================================================

const BASE = '/deezer-api';

// IDs d'artistes vérifiés sur Deezer
export const ARTIST_IDS = {
  // Focus artiste
  aupinard:       152058642,
  // Rap FR
  booba:          390,
  jul:            1191615,
  niska:          5288900,
  damso:          9197980,
  sch:            162665,
  laylow:         4510044,
  kaaris:         388973,
  freezeCorleone: 13755123,
  // Intl
  michaelJackson: 259,
  drake:          246791,
  theWeeknd:      4050205,
  beyonce:        145,
  ayaNakamura:    8909272,
};

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`Deezer API ${res.status}: ${path}`);
  return res.json();
}

/** Cherche des pistes. Retourne un tableau de tracks. */
export async function searchTracks(query, limit = 5) {
  const d = await get(`/search?q=${encodeURIComponent(query)}&limit=${limit}`);
  return d.data || [];
}

/** Cherche un artiste par nom. Retourne le premier résultat ou null. */
export async function searchArtist(name) {
  const d = await get(`/search/artist?q=${encodeURIComponent(name)}&limit=1`);
  return d.data?.[0] ?? null;
}

/** Récupère les infos complètes d'un artiste par son ID. */
export async function getArtist(id) {
  return get(`/artist/${id}`);
}

/** Récupère les top tracks d'un artiste. */
export async function getArtistTopTracks(artistId, limit = 5) {
  const d = await get(`/artist/${artistId}/top?limit=${limit}`);
  return d.data || [];
}

/** Récupère les albums d'un artiste. */
export async function getArtistAlbums(artistId, limit = 10) {
  const d = await get(`/artist/${artistId}/albums?limit=${limit}`);
  return d.data || [];
}

/** Récupère les artistes similaires / related. */
export async function getRelatedArtists(artistId) {
  const d = await get(`/artist/${artistId}/related`);
  return d.data || [];
}

/** Cherche des playlists. */
export async function searchPlaylists(query, limit = 5) {
  const d = await get(`/search/playlist?q=${encodeURIComponent(query)}&limit=${limit}`);
  return d.data || [];
}

/** Récupère le top chart global. */
export async function getChart(limit = 10) {
  const d = await get(`/chart/0/tracks?limit=${limit}`);
  return d.data || [];
}

/** Cherche des artistes par genre (requête libre). Retourne un tableau d'artistes. */
export async function searchArtistsByGenre(query, limit = 10) {
  const d = await get(`/search/artist?q=${encodeURIComponent(query)}&limit=${limit}`);
  return d.data || [];
}

/** Récupère les genres musicaux. */
export async function getGenres() {
  const d = await get('/genre');
  return d.data || [];
}

/** Récupère les playlists éditoriales (channels). */
export async function getEditorial() {
  const d = await get('/editorial');
  return d.data || [];
}

/**
 * Normalise un track Deezer API vers notre format interne.
 * Structure Deezer :
 *   { id, title, explicit_lyrics, artist: { name }, album: { cover_medium } }
 */
export function normalizeTrack(t) {
  return {
    id: t.id,
    title: t.title,
    artistName: t.artist?.name ?? '',
    explicit: t.explicit_lyrics ?? false,
    cover: t.album?.cover_medium ?? '',
  };
}
