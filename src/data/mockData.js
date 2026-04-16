// ============================================================
// DEEZER — Mock Data
// ============================================================

export const currentTrack = {
  id: 1,
  title: 'La Lettre',
  artist: 'Booba',
  album: 'Mauvais Œil',
  year: 2000,
  duration: 214,
  progress: 45,
  explicit: true,
  coverGradient: 'linear-gradient(135deg, #1a0a2e 0%, #16213e 50%, #0a0a0a 100%)',
};

export const artists = [
  {
    id: 1,
    name: 'Booba',
    listeners: '4,2M',
    albums: 12,
    tracks: 87,
    bio: 'Booba, de son vrai nom Élie Yaffa, est un rappeur franco-sénégalais né à Boulogne-Billancourt. Figure incontournable du rap français, il est connu pour son style agressif, ses métaphores acérées et sa longévité dans une scène en perpétuelle évolution.',
    coverGradient: 'linear-gradient(180deg, #2d1b69 0%, #11998e 100%)',
    image: 'https://api.deezer.com/artist/113/image',
    initials: 'B',
    similarArtists: ['Kaaris', 'SCH', 'Freeze Corleone', 'Damso', 'Jul'],
    playlists: [
      { title: 'Rap FR 2000s', fans: '1,2M fans', gradient: 'linear-gradient(135deg, #667eea, #764ba2)' },
      { title: 'Trap FR', fans: '890K fans', gradient: 'linear-gradient(135deg, #f093fb, #f5576c)' },
      { title: '92i Essentiels', fans: '450K fans', gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
    ],
    albumsList: [
      { title: 'Mauvais Œil', year: 2000, gradient: 'linear-gradient(135deg, #1a1a2e, #16213e)' },
      { title: 'Panthéon', year: 2010, gradient: 'linear-gradient(135deg, #2c3e50, #3498db)' },
      { title: 'ULTRA', year: 2018, gradient: 'linear-gradient(135deg, #0f0c29, #302b63)' },
      { title: 'CBGB', year: 2021, gradient: 'linear-gradient(135deg, #1a0a2e, #6a11cb)' },
    ],
    behindTheSong: {
      trackTitle: 'La Lettre',
      subtitle: 'Écrit en prison en 1998 · 2 min 34',
      story: 'Booba a écrit ce morceau en prison en 1998. C\'est une correspondance avec Ali pendant son incarcération alors que Lunatic commençait à percer.',
      segments: [
        {
          type: 'audio',
          title: 'Booba raconte La Lettre',
          content: 'J\'avais rien d\'autre que du temps et un carnet. Ali était dehors, le groupe commençait à buzzer, et moi j\'étais là à écrire des lettres que je savais qu\'il lirait sur scène.',
          duration: '2 min 34',
        },
        {
          type: 'voicenote',
          title: 'Voice note originale',
          content: 'Enregistrement sur répondeur depuis la prison. La qualité est volontairement laissée brute.',
          duration: '0:47',
        },
        {
          type: 'timestamp',
          title: 'À 0:45 dans le morceau',
          content: '"Cette punchline, je l\'ai écrite la nuit avant mon jugement." — Booba, 2023',
          timestamp: '0:45',
        },
      ],
    },
  },
  {
    id: 2,
    name: 'aupinard',
    realName: 'Frédéric Yoan Opina',
    deezerApiId: 152058642,
    profession: 'Auteur · Compositeur · Interprète',
    genre: 'Bossa Nova · R&B · Soul',
    location: 'Bordeaux, France',
    certified: false,
    listeners: '66K',
    albums: 22,
    tracks: 60,
    bio: "Né à Bordeaux en 2001, d'origine congolaise, Frédéric Yoan Opina construit aupinard comme une conversation intime entre bossa nova et R&B. Son surnom vient de la contraction de son nom Opina et de 'pinard' — clin d'œil bordelais donné par un ami en 5ème. À 19 ans, il demande spontanément à jouer lors d'un open mic Rue des Remparts. C'est le déclic. Pendant le confinement, il développe son univers dans sa chambre, posté sur TikTok par une amie. Sa rencontre avec Luidji en 2022 à l'Olympia devient déterminante.",
    coverGradient: 'linear-gradient(180deg, #1a1a2e 0%, #4a1942 100%)',
    image: 'https://api.deezer.com/artist/152058642/image',
    initials: 'A',
    universeTags: ['Intimiste', 'Bossa Nova', 'R&B', 'Poétique', 'Sensoriel'],
    popularAlbum: {
      title: 'pluie, montagnes et soleil',
      year: 2025, tracks: 10,
      cover: 'https://cdn-images.dzcdn.net/images/cover/4ac90491c0ae1956af7c470b7a4871dd/500x500-000000-80-0-0.jpg',
    },
    albumsList: [
      { title: 'spleen. social club',        year: 2026, type: 'Album',   cover: 'https://cdn-images.dzcdn.net/images/cover/4ac90491c0ae1956af7c470b7a4871dd/250x250-000000-80-0-0.jpg' },
      { title: 'pluie, montagnes et soleil', year: 2025, type: 'Album',   cover: 'https://cdn-images.dzcdn.net/images/cover/4ac90491c0ae1956af7c470b7a4871dd/250x250-000000-80-0-0.jpg' },
      { title: 'aupitape 1 : hortensia',     year: 2023, type: 'EP',      cover: 'https://cdn-images.dzcdn.net/images/cover/ec715a0a0c364cbe43b9460979f0acee/250x250-000000-80-0-0.jpg' },
      { title: 'quel type de vibe ?',        year: 2023, type: 'Single',  cover: 'https://cdn-images.dzcdn.net/images/cover/c47189ac043fc60aa7d40f5072179fb7/250x250-000000-80-0-0.jpg' },
    ],
    similarArtists: ['Luidji', 'Ichon', 'Terrenoire', 'Eddy de Pretto', 'Hoshi'],
    playlists: [
      { title: 'Bossa Nova & Chill', fans: '340K fans', gradient: 'linear-gradient(135deg, #2d6a4f, #52b788)' },
      { title: 'R&B Français',       fans: '210K fans', gradient: 'linear-gradient(135deg, #6b21a8, #a855f7)' },
      { title: 'Nuits douces',       fans: '180K fans', gradient: 'linear-gradient(135deg, #1e3a5f, #4facfe)' },
    ],
    socialNetworks: [
      { label: 'Instagram', handle: '@aupinard' },
      { label: 'TikTok',    handle: '@aupinard' },
      { label: 'YouTube',   handle: 'aupinard' },
    ],
    importantPlaces: [
      { name: 'Bordeaux',   role: "Mes débuts — open mic Rue des Remparts" },
      { name: 'Paris',      role: "La scène — Hasard Ludique, Café de la Danse" },
      { name: "L'Olympia",  role: "La consécration — février 2025" },
    ],
    wordFromArtist: {
      text: '"La pluie c\'est ces périodes un peu chiantes en amour. Les montagnes, c\'est quand tu te dis qu\'il faut s\'en sortir. Le soleil, c\'est ce jour où tu te réveilles et tu souffres beaucoup moins."',
      duration: '1:14',
    },
    inspirations: [
      { name: 'João Gilberto', type: 'Artiste' },
      { name: "D'Angelo",      type: 'Artiste' },
      { name: 'Erykah Badu',   type: 'Artiste' },
      { name: 'Luidji',        type: 'Mentor'  },
    ],
    qAndA: [
      { q: 'Comment est né aupinard ?',
        a: "À un open mic à Bordeaux, j'ai demandé si je pouvais jouer avec des inconnus. Là j'ai su que c'était ça." },
      { q: "C'est quoi l'ADN d'aupinard ?",
        a: "La bossa nova des playlists de ma mère, mélangée au R&B que j'écoutais le soir dans ma chambre." },
      { q: 'Pourquoi toujours en minuscules ?',
        a: "C'est une façon de rester à hauteur des gens. Pas de majuscule, pas d'ego." },
    ],
    backstageCreations: [
      {
        id: 'pluie', title: 'pluie, montagnes et soleil', type: 'Album', year: 2025, tracks: 10,
        cover: 'https://cdn-images.dzcdn.net/images/cover/4ac90491c0ae1956af7c470b7a4871dd/250x250-000000-80-0-0.jpg',
        citation: '"La pluie, les montagnes, le soleil — c\'est les trois actes d\'une histoire d\'amour qui se finit bien, mais pas sans cicatrices."',
        streams: '2.1M', likes: '48K',
        processus: "Enregistré entre Bordeaux et Paris en 2024. Chaque titre correspond à une émotion précise vécue dans une relation. 'penelope' a été écrit en 20 minutes, un soir de pluie.",
        inspirations: ['João Gilberto', 'Frank Ocean', 'Jorja Smith'],
        qAndA: [{ q: 'Quel titre a été le plus difficile ?', a: "'les rêves sont dangereux'. J'ai recommencé 4 fois avant de trouver le bon angle." }],
      },
      {
        id: 'hortensia', title: 'aupitape 1 : hortensia', type: 'EP', year: 2023, tracks: 7,
        cover: 'https://cdn-images.dzcdn.net/images/cover/ec715a0a0c364cbe43b9460979f0acee/250x250-000000-80-0-0.jpg',
        citation: '"Hortense, c\'est ma grand-mère. Cet EP, c\'est tout ce qu\'elle m\'a transmis sans le savoir."',
        streams: '890K', likes: '21K',
        processus: "Premier projet signé BMG. Enregistré partiellement dans sa chambre de Bordeaux. 'texto' a été le premier titre à buzzer.",
        inspirations: ['Bossa Nova brésilienne', "D'Angelo", 'Erykah Badu'],
        qAndA: [{ q: 'Pourquoi dédier cet EP à ta grand-mère ?', a: "Elle s'appelait Hortense. Elle avait cette douceur que j'essaie de mettre dans ma musique." }],
      },
    ],
    behindTheSong: {
      trackTitle: 'quel type de vibe ?',
      subtitle: 'Sorti en octobre 2023 · viral TikTok',
      story: "\"quel type de vibe\" n'a rien de bossa nova dedans — c'est là où je commence à me détacher de l'étiquette. Tout ce que je faisais avant était bossa novaesque, mais là c'est autre chose.",
      segments: [
        { type: 'audio', title: 'aupinard raconte le déclic',
          content: "J'ai arrêté de vouloir être dans une case. Ce son-là, c'était moi qui m'en sortais.",
          duration: '1:02' },
      ],
    },
  },
];

// Deezer artist image endpoints (redirects to CDN images — work as <img src>)
// Format: https://api.deezer.com/artist/{id}/image
// Known IDs: Michael Jackson=259, Shakira=87, JUL=9635624, LF System=14808853

export const homeData = {
  recentPlaylists: [
    // type:'pin' → bouton Épingler
    { id: 1, type: 'pin' },
    // type:'flow' → carte Flow avec gradient violet/rose
    { id: 2, type: 'flow' },
    // Cartes avec vraies pochettes
    {
      id: 3,
      title: 'Miss Kitoko',
      image: 'https://api.deezer.com/artist/5313006/image',
      fallbackGradient: 'linear-gradient(160deg, #1c1034 0%, #4a1968 100%)',
    },
    {
      id: 4,
      title: 'CHILL\u{1F9E1}',
      // Pas d'image API fiable — on utilise un style de pochette Deezer
      gradient: 'linear-gradient(140deg, #ff6b35 0%, #f7931e 45%, #ffcc02 100%)',
      overlayText: 'CHILL',
    },
    {
      id: 5,
      title: 'Addicted t...',
      image: 'https://api.deezer.com/artist/87/image', // Shakira
      fallbackGradient: 'linear-gradient(135deg, #8b0000 0%, #c94b4b 100%)',
    },
    {
      id: 6,
      title: 'NOSTALGI...',
      gradient: 'linear-gradient(135deg, #6a3093 0%, #a044ff 60%, #e96c6c 100%)',
      overlayText: 'NOSTALGI',
    },
    {
      id: 7,
      title: '2024',
      gradient: 'linear-gradient(135deg, #0f0c29 0%, #302b63 60%, #24243e 100%)',
      overlayText: '2024',
      bigText: true,
    },
    // type:'discover' → carte Découverte avec icône étoile
    { id: 8, type: 'discover' },
  ],

  mixes: [
    {
      id: 1,
      title: 'La miss',
      artist: 'JUL',
      explicit: true,
      image: 'https://api.deezer.com/artist/9635624/image',
      fallbackGradient: 'linear-gradient(135deg, #1a3a5c, #2a7fbf)',
      suggestImage: 'https://api.deezer.com/album/248277902/image',
      suggestGradient: 'linear-gradient(135deg, #0d3349, #1a6fa8)',
    },
    {
      id: 2,
      title: 'Chicago',
      artist: 'Michael Jackson',
      explicit: false,
      image: 'https://api.deezer.com/artist/259/image',
      fallbackGradient: 'linear-gradient(135deg, #1a1a1a, #333)',
      suggestImage: 'https://api.deezer.com/album/302127/image', // Thriller
      suggestGradient: 'linear-gradient(135deg, #2c1810, #8b4513)',
    },
    {
      id: 3,
      title: 'Afraid To Feel',
      artist: 'LF System',
      explicit: false,
      image: 'https://api.deezer.com/artist/14808853/image',
      fallbackGradient: 'linear-gradient(135deg, #e91e63, #9c27b0)',
      suggestImage: 'https://api.deezer.com/artist/5313006/image',
      suggestGradient: 'linear-gradient(135deg, #c9184a, #ff4d6d)',
    },
  ],

  flowMoods: [
    { label: 'Good vibes', icon: 'goodVibes',  gradient: 'linear-gradient(135deg, #A238FF, #FF5C8A)' },
    { label: 'Love',       icon: 'love',        gradient: 'linear-gradient(135deg, #A238FF, #FF5C8A)' },
    { label: 'Motivation', icon: 'motivation',  gradient: 'linear-gradient(135deg, #A238FF, #FF5C8A)' },
    { label: 'Chill',      icon: 'chill',       gradient: 'linear-gradient(135deg, #A238FF, #FF5C8A)' },
    { label: 'Tristesse',  icon: 'tristesse',   gradient: 'linear-gradient(135deg, #A238FF, #FF5C8A)' },
    { label: 'Focus',      icon: 'focus',       gradient: 'linear-gradient(135deg, #A238FF, #FF5C8A)' },
    { label: 'Soirée',     icon: 'soiree',      gradient: 'linear-gradient(135deg, #A238FF, #FF5C8A)' },
    { label: 'Découverte', icon: 'decouverte',  gradient: 'linear-gradient(135deg, #A238FF, #FF5C8A)' },
  ],
};
