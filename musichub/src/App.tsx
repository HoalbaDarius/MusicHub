// src/App.tsx
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import MainScreen from './components/MainScreen/MainScreen';
import Events from './components/Events/Events';
import ShoppingCart from './components/ShoppingCart/ShoppingCart';
import { StyleThemeOption } from './components/ThemeCarousel/ThemeCarousel';
import SakuraAnimation from './components/SakuraAnimation/SakuraAnimation';
import RockMusicAnimation from './components/RockOverlayAnimation/RockOverlayAnimation';
import KPopOverlayAnimation from './components/KPopOverlayAnimation/KPopOverlayAnimation';
import TrapOverlayAnimation from './components/TrapOverlayAnimation/TrapOverlayAnimation';
import MusicPlayer from './components/MusicPlayer/MusicPlayer';
import { CartProvider } from './context/CartContext'; // Import CartProvider
import './index.css'; // Global styles

type Theme = 'light' | 'dark';
type StyleThemeId = 'default' | 'japanese' | 'kpop' | 'trap' | 'rock';
// Add 'cart' to PageView type
type PageView = 'main' | 'events' | 'cart';

// Define interface for music items
export interface SongPreview {
  songUrl: string;
  songTitle: string;
  artistName: string;
  coverImage: string;
}

// Define the available style themes with image URLs
const availableStyleThemes: StyleThemeOption[] = [
    { id: 'default', name: 'Default', imageUrl: 'https://i.scdn.co/image/ab67616d0000b27310e6745bb2f179dd3616b85f', imgBanner: 'https://i.scdn.co/image/ab67616d0000b27310e6745bb2f179dd3616b85f' },
    { id: 'japanese', name: 'Japanese', imageUrl: 'https://rimage.gnst.jp/livejapan.com/public/article/detail/a/00/02/a0002400/img/basic/a0002400_main.jpg', imgBanner: 'https://www.datocms-assets.com/101439/1741966599-cherry-blossoms.avif?auto=format&fit=crop&h=800&w=1200' },
    { id: 'kpop', name: 'K-Pop', imageUrl: 'https://www.billboard.com/wp-content/uploads/media/01-Pop-Stars-Open-2018-billboard-1548.jpg?w=1024', imgBanner: 'https://wallpapers.com/images/featured/bts-concert-pictures-quogqof06g4312p9.jpg' },
    { id: 'trap', name: 'Trap', imageUrl: 'https://images.genius.com/22ab0dce096d9e0f51ea204d3f2140b9.1000x1000x1.png', imgBanner: 'https://i.ytimg.com/vi/YrHvrQyZ7IA/hq720.jpg?sqp=-oaymwE7CK4FEIIDSFryq4qpAy0IARUAAAAAGAElAADIQj0AgKJD8AEB-AH-CYAC0AWKAgwIABABGGUgWihLMA8=&rs=AOn4CLB3P4z-N37wU7R0BQdSi0zrmCkpeA' },
    { id: 'rock', name: 'Rock', imageUrl: 'https://www.nme.com/wp-content/uploads/2024/10/Slipknot-posing.jpg', imgBanner: 'https://i.ytimg.com/vi/Smag19uBlUw/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCsPDOclopj0eUh2F_00fWGtbCZRg' },
];

function App() {
  // Theme state
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  // Style theme state
  const [styleTheme, setStyleTheme] = useState<StyleThemeId>(() => {
      const savedStyle = localStorage.getItem('styleTheme');
      // Ensure savedStyle is a valid StyleThemeId
      const isValidSavedStyle = availableStyleThemes.some(t => t.id === savedStyle);
      return isValidSavedStyle ? savedStyle as StyleThemeId : 'default';
  });

  // Current page state - Updated type
  const [currentPage, setCurrentPage] = useState<PageView>('main');

  // Banner image state
  const [imgBanner, setImgBanner] = useState<string>(''); // Initialize empty, set in useEffect

  // Music player state
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [currentSong, setCurrentSong] = useState<SongPreview | null>(null);

  // Effect to update document attributes, localStorage, and banner
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-style-theme', styleTheme);
    localStorage.setItem('styleTheme', styleTheme);

    // Update the banner image based on the selected style theme
    const selectedThemeData = availableStyleThemes.find(t => t.id === styleTheme);
    const defaultBanner = availableStyleThemes.find(t => t.id === 'default')?.imgBanner || ''; // Fallback banner
    setImgBanner(selectedThemeData?.imgBanner || defaultBanner);

  }, [theme, styleTheme]); // Dependencies: theme and styleTheme

  // Function to toggle light/dark theme
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Function to change the style theme
  const handleStyleThemeChange = (themeId: string) => {
      const isValidThemeId = availableStyleThemes.some(t => t.id === themeId);
      if (isValidThemeId) {
          setStyleTheme(themeId as StyleThemeId);
      }
  }

  // Function to handle song preview
  const handlePreviewSong = (song: SongPreview) => {
    setCurrentSong(song);
    setIsPlayerVisible(true);
  };

  // Function to close music player
  const handleClosePlayer = () => {
    setIsPlayerVisible(false);
    // Optional: Delay clearing the song for smoother animation exit
    setTimeout(() => setCurrentSong(null), 300);
  };

  // Updated navigateTo function to handle all PageView types
  const navigateTo = (page: PageView) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Scroll to top on page change
  };

  return (
    // Wrap the entire application content with CartProvider
    <CartProvider>
      <div className="app-container">
        {/* Pass the updated navigateTo function and currentPage type */}
        <Navbar
          theme={theme}
          toggleTheme={toggleTheme}
          currentPage={currentPage}
          onNavigate={navigateTo}
        />

        {/* Theme-specific animations */}
        <SakuraAnimation isActive={styleTheme === 'japanese'} />
        <RockMusicAnimation isActive={styleTheme === 'rock'} elementCount={20} />
        <KPopOverlayAnimation isActive={styleTheme === 'kpop'} elementCount={20} />
        <TrapOverlayAnimation isActive={styleTheme === 'trap'} elementCount={15} />

        {/* --- Page Content --- */}
        <div className="page-content"> {/* Optional wrapper for content below navbar */}
            {/* Conditional rendering based on current page */}
            {currentPage === 'main' && (
              <MainScreen
                theme={theme}
                styleThemes={availableStyleThemes}
                currentStyleTheme={styleTheme}
                onStyleThemeChange={handleStyleThemeChange}
                imgBanner={imgBanner}
                onPreviewSong={handlePreviewSong}
              />
            )}

            {currentPage === 'events' && (
              <Events />
            )}

            {/* Add conditional rendering for the ShoppingCart page */}
            {currentPage === 'cart' && (
              // Pass navigateTo to allow navigation from cart (e.g., back to shop)
              <ShoppingCart onNavigate={navigateTo} />
            )}
        </div>

        {/* --- Overlays / Global Components --- */}
        {/* Music Player */}
        {isPlayerVisible && currentSong && (
          <MusicPlayer
            songUrl={currentSong.songUrl}
            songTitle={currentSong.songTitle}
            artistName={currentSong.artistName}
            coverImage={currentSong.coverImage}
            onClose={handleClosePlayer}
          />
        )}
      </div>
    </CartProvider>
  );
}

export default App;