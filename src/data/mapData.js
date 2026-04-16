// ============================================================
// DEEZER MAP — Mock Events Data
// ============================================================

export const mapEvents = [
  {
    id: 'evt1',
    name: 'aupinard en showcase',
    type: 'showcase',
    artists: [{ name: 'aupinard', mockId: 2 }],
    venue: { name: 'Rock School Barbey', address: '18 cours Barbey, Bordeaux' },
    lat: 44.8295, lng: -0.5773,
    date: '2026-04-18', time: '20:30',
    price: 12,
    status: 'available',
    remainingTickets: 24,
    isHot: true,
    isEmerging: true,
    ticketsSellingFast: true,
    genre: 'rnb',
    image: 'https://cdn-images.dzcdn.net/images/cover/4ac90491c0ae1956af7c470b7a4871dd/250x250-000000-80-0-0.jpg',
    likes: 142,
  },
  {
    id: 'evt1b',
    name: 'Soirée R&B Bordeaux',
    ticketsSellingFast: true,
    type: 'concert',
    artists: [{ name: 'Chilla' }, { name: 'Leys' }],
    venue: { name: 'Le Krakatoa', address: '3 av. Victor Lemerle, Mérignac' },
    lat: 44.8378, lng: -0.6461,
    date: '2026-04-19', time: '21:00',
    price: 15,
    status: 'available',
    remainingTickets: 55,
    isHot: true,
    isEmerging: false,
    genre: 'rnb',
    image: 'https://cdn-images.dzcdn.net/images/artist/632c37844be6596c04bc6d1a527c6da1/250x250-000000-80-0-0.jpg',
    likes: 224,
  },
  {
    id: 'evt1c',
    name: 'Nuit Électro — Darwin',
    type: 'festival',
    artists: [{ name: 'Fakear' }, { name: 'Møme' }],
    venue: { name: 'Darwin Ecosystème', address: '87 quai des Queyries, Bordeaux' },
    lat: 44.8479, lng: -0.5558,
    date: '2026-04-20', time: '22:30',
    price: 20,
    status: 'available',
    remainingTickets: 140,
    isHot: true,
    isEmerging: false,
    genre: 'electronic',
    image: 'https://api.deezer.com/artist/4827654/image',
    likes: 389,
  },
  {
    id: 'evt2',
    name: 'Nuit Rap FR',
    type: 'concert',
    artists: [{ name: 'Laylow' }, { name: 'Ichon' }],
    venue: { name: 'Café de la Danse', address: '5 passage Louis-Philippe, Paris 11e' },
    lat: 48.8611, lng: 2.3808,
    date: '2026-04-15', time: '21:00',
    price: 22,
    status: 'available',
    remainingTickets: 80,
    isHot: true,
    isEmerging: false,
    genre: 'rap',
    image: 'https://cdn-images.dzcdn.net/images/artist/bbcb2b1a7a1500d7fce0705a7769e93e/250x250-000000-80-0-0.jpg',
    likes: 318,
  },
  {
    id: 'evt3',
    name: 'Festival Neon — Electronic Night',
    type: 'festival',
    artists: [{ name: 'Polo & Pan' }, { name: 'Flavien Berger' }],
    venue: { name: 'Transbordeur', address: '3 bd Stalingrad, Lyon 9e' },
    lat: 45.7770, lng: 4.8625,
    date: '2026-04-19', time: '22:00',
    price: 30,
    status: 'available',
    remainingTickets: 120,
    isHot: true,
    isEmerging: false,
    genre: 'electronic',
    image: '',
    likes: 540,
  },
  {
    id: 'evt4',
    name: 'Nayra — Release Party',
    type: 'showcase',
    artists: [{ name: 'Nayra' }],
    venue: { name: 'Rock School Barbey', address: '18 cours Barbey, Bordeaux' },
    lat: 44.8295, lng: -0.5773,
    date: '2026-04-25', time: '20:00',
    price: 8,
    status: 'available',
    remainingTickets: 12,
    isHot: false,
    isEmerging: true,
    genre: 'pop',
    image: '',
    likes: 47,
  },
  {
    id: 'evt5',
    name: 'Soul & R\'n\'B Night',
    type: 'concert',
    artists: [{ name: 'Luidji' }, { name: 'Terrenoire' }],
    venue: { name: 'Espace Julien', address: '39 cours Julien, Marseille 6e' },
    lat: 43.2919, lng: 5.3797,
    date: '2026-04-22', time: '20:30',
    price: 18,
    status: 'available',
    remainingTickets: 60,
    isHot: false,
    isEmerging: false,
    genre: 'rnb',
    image: '',
    likes: 203,
  },
  {
    id: 'evt6',
    name: 'Scène Ouverte — Jazz & Soul',
    type: 'showcase',
    artists: [{ name: 'Collectif Bossa' }],
    venue: { name: 'Le Ferrailleur', address: '21 quai des Antilles, Nantes' },
    lat: 47.2063, lng: -1.5643,
    date: '2026-04-15', time: '19:30',
    price: 0,
    status: 'free',
    remainingTickets: 200,
    isHot: false,
    isEmerging: true,
    genre: 'jazz',
    image: '',
    likes: 29,
  },
  {
    id: 'evt7',
    name: 'SCH — Tournée JVLIVS III',
    type: 'concert',
    artists: [{ name: 'SCH' }],
    venue: { name: 'L\'Aéronef', address: '168 av. Willy-Brandt, Lille' },
    lat: 50.6326, lng: 3.0745,
    date: '2026-04-18', time: '20:00',
    price: 35,
    status: 'available',
    remainingTickets: 200,
    isHot: true,
    isEmerging: false,
    ticketsSellingFast: true,
    genre: 'rap',
    image: '',
    likes: 712,
  },
  {
    id: 'evt8',
    name: 'Plume — Dernier show avant pause',
    type: 'concert',
    artists: [{ name: 'Plume' }],
    venue: { name: 'La Cigale', address: '120 bd de Rochechouart, Paris 18e' },
    lat: 48.8823, lng: 2.3343,
    date: '2026-04-19', time: '20:00',
    price: 0,
    status: 'free',
    remainingTickets: 8,
    isHot: false,
    isEmerging: true,
    genre: 'indie',
    image: '',
    likes: 91,
  },
  {
    id: 'evt9',
    name: 'Kaaris & Friends',
    type: 'concert',
    artists: [{ name: 'Kaaris' }, { name: 'Freeze Corleone' }],
    venue: { name: 'L\'Ampère', address: '3 rue Vauban, Lyon 6e' },
    lat: 45.7589, lng: 4.8320,
    date: '2026-04-15', time: '21:30',
    price: 28,
    status: 'available',
    remainingTickets: 15,
    isHot: true,
    isEmerging: false,
    genre: 'rap',
    image: '',
    likes: 487,
  },
  {
    id: 'evt10',
    name: 'Julien Granel — Tournée Solo',
    type: 'concert',
    artists: [{ name: 'Julien Granel' }],
    venue: { name: 'Le Rocher de Palmer', address: '1 rue Aristide Briand, Cenon' },
    lat: 44.8637, lng: -0.5241,
    date: '2026-04-26', time: '21:00',
    price: 18,
    status: 'available',
    remainingTickets: 22,
    isHot: false,
    isEmerging: true,
    ticketsSellingFast: false,
    genre: 'pop',
    image: '',
    likes: 67,
  },
];

export const TYPE_LABELS = {
  concert:  'Concert',
  showcase: 'Showcase',
  festival: 'Festival',
};

export const GENRE_LABELS = {
  rap:        'Rap',
  rnb:        'R&B',
  electronic: 'Électro',
  pop:        'Pop',
  jazz:       'Jazz',
  indie:      'Indie',
  variete:    'Variété',
  rock:       'Rock',
};

// ============================================================
// DEEZER MAP — Départements & Artistes
// ============================================================
// Chaque département affiche UN seul artiste avec sa vraie
// photo Deezer CDN (250x250). Plus de lettre de fallback.
//
// Photos vérifiées via API Deezer search :
//   Booba        id 390       → Paris (75)
//   Niska        id 5288900   → Seine-Saint-Denis (93)
//   Freeze       id 13755123  → Yvelines (78)
//   Orelsan      id 259467    → Normandie (76)
//   Nekfeu       id 1412564   → Hauts-de-France (59)
//   Vald         id 5175734   → Grand Est (67)
//   Chilla       id 4121259   → Nouvelle-Aquitaine (33)
//   Bigflo & Oli id 5497121   → Haute-Garonne (31)
//   Luidji       id 5617685   → Rhône (69)
//   Laylow       id 4510044   → Bretagne (35)
//   Eddy Pretto  id 9030084   → Pays de la Loire (44)
//   Jul          id 1191615   → Bouches-du-Rhône (13)
// ============================================================

const CDN = (hash) =>
  `https://cdn-images.dzcdn.net/images/artist/${hash}/250x250-000000-80-0-0.jpg`;

export const deptArtists = {

  // ── Hauts-de-France — NEKFEU ────────────────────────────
  '59': {
    num: '59', name: 'Nord', region: 'Hauts-de-France',
    lat: 50.47, lng: 3.10,
    artists: [
      { name: 'Nekfeu', genre: 'rap', streamsMonth: 540000, trend: 'up', monthsChampion: 5, isChampion: true,
        photo: CDN('0c093e137a288db8d08133ecf092c213') },
    ],
  },

  // ── Normandie — ORELSAN ─────────────────────────────────
  '76': {
    num: '76', name: 'Seine-Maritime', region: 'Normandie',
    lat: 49.44, lng: 1.10,
    artists: [
      { name: 'Orelsan', genre: 'rap', streamsMonth: 820000, trend: 'up', monthsChampion: 8, isChampion: true,
        photo: CDN('cb21b6617783e6050240ba76ca9b3034') },
    ],
  },

  // ── Grand Est — VALD ────────────────────────────────────
  '67': {
    num: '67', name: 'Bas-Rhin', region: 'Grand Est',
    lat: 48.58, lng: 7.75,
    artists: [
      { name: 'Vald', genre: 'rap', streamsMonth: 680000, trend: 'stable', monthsChampion: 4, isChampion: true,
        photo: CDN('c49cad70e83b5dccd3ebd0c96cb098d4') },
    ],
  },

  // ── Île-de-France — Paris — BOOBA ───────────────────────
  '75': {
    num: '75', name: 'Paris', region: 'Île-de-France',
    lat: 48.86, lng: 2.35,
    artists: [
      { name: 'Booba', mockId: 1, genre: 'rap', streamsMonth: 1200000, trend: 'stable', monthsChampion: 6, isChampion: true,
        photo: CDN('38b687e97c6874e744d305ef2ca8d0d0') },
    ],
  },

  // ── Île-de-France — Yvelines — FREEZE CORLEONE ──────────
  '78': {
    num: '78', name: 'Yvelines', region: 'Île-de-France',
    lat: 48.77, lng: 1.85,
    artists: [
      { name: 'Freeze Corleone', genre: 'rap', streamsMonth: 640000, trend: 'stable', monthsChampion: 8, isChampion: true,
        photo: CDN('cdac7dd9008bcce4c12809c93989e348') },
    ],
  },

  // ── Île-de-France — Seine-Saint-Denis — NISKA ───────────
  '93': {
    num: '93', name: 'Seine-Saint-Denis', region: 'Île-de-France',
    lat: 48.91, lng: 2.49,
    artists: [
      { name: 'Niska', genre: 'rap', streamsMonth: 980000, trend: 'up', monthsChampion: 3, isChampion: true,
        photo: CDN('f03af182a46b9f16be9c3a16d0771286') },
    ],
  },

  // ── Bretagne — LAYLOW ───────────────────────────────────
  '35': {
    num: '35', name: 'Ille-et-Vilaine', region: 'Bretagne',
    lat: 48.10, lng: -1.67,
    artists: [
      { name: 'Laylow', genre: 'rap', streamsMonth: 395000, trend: 'new', monthsChampion: 1, isChampion: true,
        photo: CDN('bbcb2b1a7a1500d7fce0705a7769e93e') },
    ],
  },

  // ── Pays de la Loire — EDDY DE PRETTO ──────────────────
  '44': {
    num: '44', name: 'Loire-Atlantique', region: 'Pays de la Loire',
    lat: 47.22, lng: -1.55,
    artists: [
      { name: 'Eddy de Pretto', genre: 'pop', streamsMonth: 310000, trend: 'up', monthsChampion: 2, isChampion: true,
        photo: CDN('08259996f2d2536a959781892b77fa82') },
    ],
  },

  // ── Nouvelle-Aquitaine — AUPINARD ───────────────────────
  '33': {
    num: '33', name: 'Gironde', region: 'Nouvelle-Aquitaine',
    lat: 44.83, lng: -0.58,
    artists: [
      { name: 'aupinard', mockId: 2, genre: 'rnb', streamsMonth: 480000, trend: 'up', monthsChampion: 3, isChampion: true,
        photo: CDN('b17c24f603a11da0c5c4dafb2fbb4778') },
      { name: 'Chilla', genre: 'rap', streamsMonth: 280000, trend: 'up', monthsChampion: 0, isChampion: false,
        photo: CDN('632c37844be6596c04bc6d1a527c6da1') },
      { name: 'Julien Granel', genre: 'pop', streamsMonth: 175000, trend: 'up', monthsChampion: 1, isChampion: false,
        photo: '' },
      { name: 'Pépite', genre: 'pop', streamsMonth: 95000, trend: 'new', monthsChampion: 0, isChampion: false,
        photo: '' },
    ],
  },

  // ── Occitanie — Toulouse — BIGFLO & OLI ─────────────────
  '31': {
    num: '31', name: 'Haute-Garonne', region: 'Occitanie',
    lat: 43.39, lng: 1.44,
    artists: [
      { name: 'Bigflo & Oli', genre: 'rap', streamsMonth: 820000, trend: 'up', monthsChampion: 7, isChampion: true,
        photo: CDN('07408e0ffeeae4b388e5b35c22c3ede3') },
    ],
  },

  // ── Auvergne-Rhône-Alpes — LUIDJI ──────────────────────
  '69': {
    num: '69', name: 'Rhône', region: 'Auvergne-Rhône-Alpes',
    lat: 45.75, lng: 4.85,
    artists: [
      { name: 'Luidji', genre: 'rnb', streamsMonth: 560000, trend: 'up', monthsChampion: 5, isChampion: true,
        photo: CDN('d9dd12e27eef5186a56cdcfafefb80df') },
    ],
  },

  // ── PACA — Marseille — JUL ──────────────────────────────
  '13': {
    num: '13', name: 'Bouches-du-Rhône', region: 'Provence-Alpes-Côte d\'Azur',
    lat: 43.53, lng: 5.45,
    artists: [
      { name: 'Jul', genre: 'rap', streamsMonth: 2100000, trend: 'up', monthsChampion: 12, isChampion: true,
        photo: CDN('fe5d5fb7fabf145f68254f4b5d3034b9') },
    ],
  },
};
