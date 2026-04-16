import { useState, useEffect } from 'react';
import { artists } from '../data/mockData.js';
import {
  getArtist,
  getArtistTopTracks,
  getArtistAlbums,
  getRelatedArtists,
  searchPlaylists,
  normalizeTrack,
} from '../api/deezer.js';
import ProfileView from './artist/ProfileView.jsx';
import BioView from './artist/BioView.jsx';
import BackstageView from './artist/BackstageView.jsx';
import CreationView from './artist/CreationView.jsx';

export default function ArtistPage({ artistId, onBack, onOpenPlayer }) {
  const [view, setView] = useState('profile');
  const [selectedCreation, setSelectedCreation] = useState(null);

  const [artistInfo, setArtistInfo]       = useState(null);   // photo + nb_fan
  const [topTracks, setTopTracks]         = useState([]);
  const [apiAlbums, setApiAlbums]         = useState([]);
  const [relatedArtists, setRelatedArtists] = useState([]);
  const [apiPlaylists, setApiPlaylists]   = useState([]);

  const artist = artists.find(a => a.id === artistId) || artists[1];

  useEffect(() => {
    if (!artist.deezerApiId) return;
    const id = artist.deezerApiId;

    getArtist(id)
      .then(setArtistInfo)
      .catch(() => {});

    getArtistTopTracks(id, 5)
      .then(tracks => setTopTracks(tracks.map(normalizeTrack)))
      .catch(() => {});

    getArtistAlbums(id, 8)
      .then(setApiAlbums)
      .catch(() => {});

    getRelatedArtists(id)
      .then(setRelatedArtists)
      .catch(() => {});

    searchPlaylists(artist.name, 6)
      .then(setApiPlaylists)
      .catch(() => {});
  }, [artist.deezerApiId]);

  const handleSelectCreation = (creation) => {
    setSelectedCreation(creation);
    setView('creation');
  };

  const handleBack = () => {
    if (view === 'creation') {
      setView('backstage');
      setSelectedCreation(null);
    } else if (view === 'backstage' || view === 'bio') {
      setView('profile');
    } else {
      onBack();
    }
  };

  if (view === 'bio') {
    return (
      <BioView
        artist={artist}
        onBack={handleBack}
        onViewBackstage={() => setView('backstage')}
      />
    );
  }

  if (view === 'backstage') {
    return (
      <BackstageView
        artist={artist}
        onBack={handleBack}
        onSelectCreation={handleSelectCreation}
      />
    );
  }

  if (view === 'creation' && selectedCreation) {
    return (
      <CreationView
        creation={selectedCreation}
        artist={artist}
        onBack={handleBack}
      />
    );
  }

  return (
    <ProfileView
      artist={artist}
      artistInfo={artistInfo}
      topTracks={topTracks}
      apiAlbums={apiAlbums}
      relatedArtists={relatedArtists}
      apiPlaylists={apiPlaylists}
      onBack={onBack}
      onOpenPlayer={onOpenPlayer}
      onViewBio={() => setView('bio')}
      onViewBackstage={() => setView('backstage')}
    />
  );
}
