// src/components/Navbar/Navbar.tsx
import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { Sun, Moon, Menu, X } from 'lucide-react';

interface NavbarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  currentPage: 'main' | 'events';
  onNavigate: (page: 'main' | 'events') => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  theme, 
  toggleTheme, 
  currentPage, 
  onNavigate 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // State to track scroll position
  const [isScrolled, setIsScrolled] = useState(false);

  const handleToggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Effect to handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      // Set state based on scroll position (e.g., > 10px)
      setIsScrolled(window.scrollY > 10);
    };

    // Add event listener when component mounts
    window.addEventListener('scroll', handleScroll);

    // Remove event listener when component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array means this effect runs only once on mount and cleanup on unmount

  // Handle navigation with page change
  const handleNavigate = (page: 'main' | 'events', event: React.MouseEvent) => {
    event.preventDefault();
    onNavigate(page);
    closeMobileMenu();
  };

  return (
    // Apply 'navbar--scrolled' class when scrolled OR on events page
    <nav className={`navbar smooth-transition ${isMobileMenuOpen ? 'mobile-open' : ''} ${isScrolled || currentPage === 'events' ? 'navbar--scrolled' : ''}`}>
      <div className="navbar-container">
        <a 
          href="/" 
          className="navbar-logo" 
          onClick={(e) => handleNavigate('main', e)}
        >
          MusicHub
        </a>

        <div className="menu-icon" onClick={handleToggleMobileMenu}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </div>

        <ul className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <a 
              href="/" 
              className={`nav-links ${currentPage === 'main' ? 'active' : ''}`} 
              onClick={(e) => handleNavigate('main', e)}
            >
              Home
            </a>
          </li>
          <li className="nav-item">
            <a 
              href="/events" 
              className={`nav-links ${currentPage === 'events' ? 'active' : ''}`} 
              onClick={(e) => handleNavigate('events', e)}
            >
              Events
            </a>
          </li>
          {currentPage === 'main' && (
            <>
              <li className="nav-item">
                <a href="#music" className="nav-links" onClick={closeMobileMenu}>
                  Music
                </a>
              </li>
              <li className="nav-item">
                <a href="#merch" className="nav-links" onClick={closeMobileMenu}>
                  Merch
                </a>
              </li>
              <li className="nav-item">
                <a href="#recommendations" className="nav-links" onClick={closeMobileMenu}>
                  Recommendations
                </a>
              </li>
            </>
          )}
          <li className="nav-item nav-item-theme-toggle">
             <button onClick={toggleTheme} className="theme-toggle-button smooth-transition" aria-label="Toggle Theme">
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                <span className="sr-only">Toggle Theme</span>
            </button>
          </li>
        </ul>

         <button onClick={toggleTheme} className="theme-toggle-button-desktop smooth-transition" aria-label="Toggle Theme">
             {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
             <span className="sr-only">Toggle Theme</span>
         </button>
      </div>
    </nav>
  );
};

export default Navbar;