// src/App.tsx
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import { StyleThemeOption } from './components/ThemeCarousel/ThemeCarousel';
import MainScreen from './components/MainScreen/MainScreen';
import SakuraAnimation from './components/SakuraAnimation/SakuraAnimation';
import RockMusicAnimation from './components/RockOverlayAnimation/RockOverlayAnimation';
import KPopOverlayAnimation from './components/KPopOverlayAnimation/KPopOverlayAnimation';
import TrapOverlayAnimation from './components/TrapOverlayAnimation/TrapOverlayAnimation';
// Import the updated interface type if it includes imageUrl
import './index.css';

type Theme = 'light' | 'dark';
type StyleThemeId = 'default' | 'japanese' | 'kpop' | 'trap' | 'rock';
type PageView = 'main' | 'events';

// Define interfaces for music items
export interface SongPreview {
  songUrl: string;
  songTitle: string;
  artistName: string;
  coverImage: string;
}

// Define the available style themes with image URLs
// *** Replace placeholder image URLs ***
const availableStyleThemes: StyleThemeOption[] = [
    {
        id: 'default',
        name: 'Default',
        imageUrl: 'https://i.scdn.co/image/ab67616d0000b27310e6745bb2f179dd3616b85f', // Placeholder
        imgBanner: 'https://i.scdn.co/image/ab67616d0000b27310e6745bb2f179dd3616b85f' // Placeholder
    },
    {
        id: 'japanese',
        name: 'Japanese',
        imageUrl: 'https://rimage.gnst.jp/livejapan.com/public/article/detail/a/00/02/a0002400/img/basic/a0002400_main.jpg', // Placeholder
        imgBanner: 'https://www.datocms-assets.com/101439/1741966599-cherry-blossoms.avif?auto=format&fit=crop&h=800&w=1200' // Placeholder
    },
    {
        id: 'kpop',
        name: 'K-Pop',
        imageUrl: 'https://www.billboard.com/wp-content/uploads/media/01-Pop-Stars-Open-2018-billboard-1548.jpg?w=1024', // Placeholder
        imgBanner: 'https://wallpapers.com/images/featured/bts-concert-pictures-quogqof06g4312p9.jpg' // Placeholder
    },
    {
        id: 'trap',
        name: 'Trap',
        imageUrl: 'https://images.genius.com/22ab0dce096d9e0f51ea204d3f2140b9.1000x1000x1.png', // Placeholder
        imgBanner: 'https://i.ytimg.com/vi/YrHvrQyZ7IA/hq720.jpg?sqp=-oaymwE7CK4FEIIDSFryq4qpAy0IARUAAAAAGAElAADIQj0AgKJD8AEB-AH-CYAC0AWKAgwIABABGGUgWihLMA8=&rs=AOn4CLB3P4z-N37wU7R0BQdSi0zrmCkpeA' // Placeholder
    },
    {
        id: 'rock',
        name: 'Rock',
        imageUrl: 'https://www.nme.com/wp-content/uploads/2024/10/Slipknot-posing.jpg', // Placeholder
        imgBanner: 'https://i.ytimg.com/vi/Smag19uBlUw/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCsPDOclopj0eUh2F_00fWGtbCZRg' // Placeholder
    },
];

function App() {
  // State for light/dark theme
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  // State for the selected style theme
  const [styleTheme, setStyleTheme] = useState<StyleThemeId>(() => {
      const savedStyle = localStorage.getItem('styleTheme');
      if (savedStyle && availableStyleThemes.some(t => t.id === savedStyle)) {
          return savedStyle as StyleThemeId;
      }
      return 'default';
  });

  // State for the current page view
  const [currentPage, setCurrentPage] = useState<PageView>('main');

  const [imgBanner, setImgBanner] = useState<string>('https://i.scdn.co/image/ab67616d0000b27310e6745bb2f179dd3616b85f');

  // State for music player
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [currentSong, setCurrentSong] = useState<SongPreview | null>(null);

  // Effect to update attributes and localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-style-theme', styleTheme);
    localStorage.setItem('styleTheme', styleTheme);
    //update the banner image based on the selected style theme;
    const selectedTheme = availableStyleThemes.find(t => t.id === styleTheme);
    if (selectedTheme && selectedTheme.imgBanner) {
        setImgBanner(selectedTheme.imgBanner);
    } else {
        setImgBanner('https://i.scdn.co/image/ab67616d0000b27310e6745bb2f179dd3616b85f');
    }
  }, [theme, styleTheme]);

  // Function to toggle light/dark theme
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Function to change the style theme
  const handleStyleThemeChange = (themeId: string) => {
      if (availableStyleThemes.some(t => t.id === themeId)) {
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
    // Keep the current song data for a moment to allow smooth exit animation
    setTimeout(() => setCurrentSong(null), 300);
  };

  // Function to navigate between pages
  const navigateTo = (page: PageView) => {
    setCurrentPage(page);
  };

  return (
    <div className="app-container">
      <Navbar 
        theme={theme} 
        toggleTheme={toggleTheme} 
        currentPage={currentPage}
        onNavigate={navigateTo}
      />
      {/* Add Sakura animation component that only activates for the Japanese theme */}
      <SakuraAnimation isActive={styleTheme === 'japanese'} />
      <RockMusicAnimation isActive={styleTheme === 'rock'} elementCount={20} />
      <KPopOverlayAnimation isActive={styleTheme === 'kpop'} elementCount={20} />
      <TrapOverlayAnimation isActive={styleTheme === 'trap'} elementCount={15} />
      {/* Conditional rendering based on current page */}
      {currentPage === 'main' && (
        <MainScreen
          theme={theme}
          // Pass the updated themes array with image URLs
          styleThemes={availableStyleThemes}
          currentStyleTheme={styleTheme}
          onStyleThemeChange={handleStyleThemeChange}
          imgBanner={imgBanner}
          onPreviewSong={handlePreviewSong}
        />
      )}
    </div>
  );
}

export default App;