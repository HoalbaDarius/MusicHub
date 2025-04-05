// src/components/Navbar/Navbar.tsx
import React, { useState, useEffect } from 'react';
import './Navbar.css'; // Ensure Navbar.css is imported
// Import ShoppingCart icon and useCart hook
import { Sun, Moon, Menu, X, ShoppingCart as CartIcon } from 'lucide-react';
import { useCart } from '../../context/CartContext'; // Adjust path if needed

interface NavbarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  // Update currentPage type to include 'cart'
  currentPage: 'main' | 'events' | 'cart';
  // Update onNavigate function signature
  onNavigate: (page: 'main' | 'events' | 'cart') => void;
}

const Navbar: React.FC<NavbarProps> = ({
  theme,
  toggleTheme,
  currentPage,
  onNavigate
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { getCartItemCount } = useCart(); // Get cart interaction functions
  const [itemCount, setItemCount] = useState(0); // Local state for count

   // Effect to update item count when cart changes
   useEffect(() => {
       setItemCount(getCartItemCount());
   }, [getCartItemCount]); // Depend on the function itself

  const handleToggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Effect to handle scroll detection for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array means run once on mount

  // Update handleNavigate to accept all PageView types
  const handleNavigate = (page: 'main' | 'events' | 'cart', event: React.MouseEvent) => {
    event.preventDefault(); // Prevent default link behavior
    onNavigate(page);      // Call the navigation function from App
    closeMobileMenu();      // Close mobile menu if open
  };

  // Determine if the navbar should have the 'scrolled' style
  // Apply scrolled style if scrolled down OR if on events/cart page
  const navbarScrolledClass = isScrolled || ['events', 'cart'].includes(currentPage) ? 'navbar--scrolled' : '';

  return (
    <nav className={`navbar smooth-transition ${isMobileMenuOpen ? 'mobile-open' : ''} ${navbarScrolledClass}`}>
      <div className="navbar-container">
        {/* Logo links to Main page */}
        <a
          href="/"
          className="navbar-logo"
          onClick={(e) => handleNavigate('main', e)}
        >
          MusicHub
        </a>

        {/* Mobile Menu Toggle Button */}
        <div className="menu-icon" onClick={handleToggleMobileMenu} aria-label="Toggle menu">
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </div>

        {/* --- Navigation Links (Mobile Menu) --- */}
        <ul className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          {/* Home Link */}
          <li className="nav-item">
            <a
              href="/"
              className={`nav-links ${currentPage === 'main' ? 'active' : ''}`}
              onClick={(e) => handleNavigate('main', e)}
            >
              Home
            </a>
          </li>
          {/* Events Link */}
          <li className="nav-item">
            <a
              href="/events" // Use a relevant path or identifier
              className={`nav-links ${currentPage === 'events' ? 'active' : ''}`}
              onClick={(e) => handleNavigate('events', e)}
            >
              Events
            </a>
          </li>
          {/* Conditional Main Page Section Links (only show if on main page) */}
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
          {/* Theme Toggle (Mobile) */}
          <li className="nav-item nav-item-theme-toggle">
             <button onClick={toggleTheme} className="theme-toggle-button smooth-transition" aria-label="Toggle Theme">
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                <span className="sr-only">Toggle Theme</span>
            </button>
          </li>
           {/* Cart Link (Mobile) */}
           <li className="nav-item nav-item-cart-mobile">
             <a
              href="/cart" // Use a relevant path or identifier
              className={`nav-links cart-link ${currentPage === 'cart' ? 'active' : ''}`}
              onClick={(e) => handleNavigate('cart', e)}
              aria-label={`Shopping Cart: ${itemCount} items`}
            >
              <CartIcon size={20} />
              {/* Display badge only if items exist */}
              {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
               <span className='cart-link-text'>Cart</span> {/* Text label for better mobile UX */}
            </a>
          </li>
        </ul>

        {/* --- Desktop Icons Area --- */}
        <div className="navbar-desktop-icons">
            {/* Theme Toggle (Desktop) */}
            <button onClick={toggleTheme} className="theme-toggle-button-desktop smooth-transition" aria-label="Toggle Theme">
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                <span className="sr-only">Toggle Theme</span>
            </button>
             {/* Cart Link (Desktop) */}
            <a
                href="/cart" // Use a relevant path or identifier
                className={`nav-links cart-link-desktop ${currentPage === 'cart' ? 'active' : ''}`}
                onClick={(e) => handleNavigate('cart', e)}
                aria-label={`Shopping Cart: ${itemCount} items`}
             >
                <CartIcon size={22} />
                 {/* Display badge only if items exist */}
                {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </a>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;