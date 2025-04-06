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
import RapOverlayAnimation from './components/RapOverlayAnimation/RapOverlayAnimation';
import MusicPlayer from './components/MusicPlayer/MusicPlayer';
import { CartProvider } from './context/CartContext'; // Import CartProvider
import './index.css'; // Global styles

type Theme = 'light' | 'dark';
type PageView = 'main' | 'events' | 'cart';
type StyleThemeId = 'rap' | 'lofi' | 'kpop' | 'trap' | 'rock';

// Define interface for music items
export interface SongPreview {
  songUrl: string;
  songTitle: string;
  artistName: string;
  coverImage: string;
}

// Define the available style themes with image URLs
const availableStyleThemes: StyleThemeOption[] = [
    {
        id: 'rap',
        name: 'Rap',
        imageUrl: 'https://i.scdn.co/image/ab67616d0000b2735ad6c8d36eb04f6a177cbbcc', // Placeholder
        imgBanner: 'https://wallpapers.com/images/featured/tupac-pictures-5vwiry1srhvnrk9e.jpg' // Placeholder
    },
    {
        id: 'lofi',
        name: 'LoFi',
        imageUrl: 'https://i.ytimg.com/vi/Na0w3Mz46GA/hq720.jpg?v=667bf3df&sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBJ2KfY4wbZ3Q3kdxRTnUdscogmBw', // Placeholder
        imgBanner: 'https://www.datocms-assets.com/101439/1741966599-cherry-blossoms.avif?auto=format&fit=crop&h=800&w=1200' // Placeholder
    },
    {
        id: 'kpop',
        name: 'K-Pop',
        imageUrl: 'https://i.scdn.co/image/ab6761610000e5ebcd3114c3d3dc89d5ec1c9145', // Placeholder
        imgBanner: 'https://wallpapers.com/images/featured/bts-concert-pictures-quogqof06g4312p9.jpg' // Placeholder
    },
    {
        id: 'trap',
        name: 'Trap',
        imageUrl: 'https://images.genius.com/22ab0dce096d9e0f51ea204d3f2140b9.1000x1000x1.png', // Placeholder
        imgBanner: 'https://www.forest-national.be/_next/image?url=https%3A%2F%2Fdam.beatvenues.be%2Fa0WP5000007j0r4MAA_original.jpg&w=3840&q=75' // Placeholder
    },
    {
        id: 'rock',
        name: 'Rock',
        imageUrl: 'https://www.nme.com/wp-content/uploads/2024/10/Slipknot-posing.jpg', // Placeholder
        imgBanner: 'https://i.pinimg.com/736x/dc/22/d5/dc22d5ae354dd4462c4adcd5977bf158.jpg' // Placeholder
    },
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
      if (savedStyle && availableStyleThemes.some(t => t.id === savedStyle)) {
          return savedStyle as StyleThemeId;
      }
      return 'rap';
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
    <CartProvider>
    <div className="app-container">
      <Navbar 
        theme={theme} 
        toggleTheme={toggleTheme} 
        currentPage={currentPage}
        onNavigate={navigateTo}
      />
      {/* Add Sakura animation component that only activates for the Japanese theme */}
      <SakuraAnimation isActive={styleTheme === 'lofi'} />
      <RockMusicAnimation isActive={styleTheme === 'rock'} elementCount={20} />
      <KPopOverlayAnimation isActive={styleTheme === 'kpop'} elementCount={20} />
      <TrapOverlayAnimation isActive={styleTheme === 'trap'} elementCount={15} />
      <RapOverlayAnimation isActive={styleTheme === 'rap'} elementCount={15} />
      

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