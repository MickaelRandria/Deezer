import { useState } from 'react';
import './globals.css';

import NavBar from './components/NavBar.jsx';
import MiniPlayer from './components/MiniPlayer.jsx';

import { currentTrack } from './data/mockData.js';

// Pages — lazy imports remplacés par des placeholders jusqu'à ce qu'elles soient créées
import HomePage from './pages/HomePage.jsx';
import ExplorerPage from './pages/ExplorerPage.jsx';
import ArtistPage from './pages/ArtistPage.jsx';
import PlayerPage from './pages/PlayerPage.jsx';
import CreatorPage from './pages/CreatorPage.jsx';
import MapPage from './pages/MapPage.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentPage, setCurrentPage] = useState('home');
  const [previousPage, setPreviousPage] = useState('home');
  const [selectedArtistId, setSelectedArtistId] = useState(1);
  const [creatorMode, setCreatorMode] = useState(false);
  const [trackCoverUrl, setTrackCoverUrl] = useState('');

  function navigate(page, payload) {
    setPreviousPage(currentPage);
    if (page === 'artist') setSelectedArtistId(payload);
    setCurrentPage(page);
  }

  function handleTabChange(tab) {
    setActiveTab(tab);
    if (tab === 'explore') setCurrentPage('explore');
    else if (tab === 'home') setCurrentPage('home');
  }

  function renderPage() {
    if (currentPage === 'player') {
      return <PlayerPage track={currentTrack} onBack={() => setCurrentPage('home')} />;
    }
    if (currentPage === 'artist') {
      return (
        <ArtistPage
          artistId={selectedArtistId}
          onBack={() => setCurrentPage(previousPage)}
          onOpenPlayer={() => setCurrentPage('player')}
        />
      );
    }
    if (currentPage === 'map') {
      return (
        <MapPage
          onBack={() => setCurrentPage('explore')}
          onOpenArtist={(id) => navigate('artist', id)}
        />
      );
    }
    if (currentPage === 'explore') {
      return (
        <ExplorerPage
          onOpenMap={() => setCurrentPage('map')}
          onOpenPlayer={() => setCurrentPage('player')}
        />
      );
    }
    return (
      <HomePage
        onOpenArtist={(id) => navigate('artist', id)}
        onOpenPlayer={() => setCurrentPage('player')}
        onEnterCreatorMode={() => setCreatorMode(true)}
      />
    );
  }

  // Le player plein écran prend tout l'écran
  if (currentPage === 'player') {
    return (
      <div className="app-wrapper">
        <div className="page-enter">
          <PlayerPage track={currentTrack} onBack={() => setCurrentPage('home')} onCoverReady={setTrackCoverUrl} />
        </div>
      </div>
    );
  }

  return (
    <div className={`app-wrapper${creatorMode ? ' creator-mode' : ''}`}>
      {/* Mode Créateur (desktop) */}
      {creatorMode && (
        <div className="creator-fade-in">
          <CreatorPage onExitCreatorMode={() => setCreatorMode(false)} />
        </div>
      )}

      {/* Mode Mobile */}
      {!creatorMode && (
        <>
          <div className="scroll-area">
            <div key={currentPage} className="page-enter">
              {renderPage()}
            </div>
          </div>
          <MiniPlayer track={currentTrack} coverUrl={trackCoverUrl} onOpen={() => setCurrentPage('player')} />
          <NavBar activeTab={activeTab} onTabChange={handleTabChange} />
        </>
      )}
    </div>
  );
}
