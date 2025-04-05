// src/components/ThemeCarousel/ThemeCarousel.tsx
import React, { useState, useEffect, useMemo, CSSProperties } from 'react';
import './ThemeCarousel.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface StyleThemeOption {
    id: string;
    name: string;
    imageUrl: string;
    imgBanner?: string; // Optional property for banner image
}

interface ThemeCarouselProps {
    themes: StyleThemeOption[];
    currentStyleTheme: string;
    onThemeChange: (themeId: string) => void;
}

const ThemeCarousel: React.FC<ThemeCarouselProps> = ({ themes, currentStyleTheme, onThemeChange }) => {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const numThemes = useMemo(() => themes.length, [themes]);

    useEffect(() => {
        const initialIndex = themes.findIndex(theme => theme.id === currentStyleTheme);
        if (initialIndex !== -1) {
            setActiveIndex(initialIndex);
        }
        setIsTransitioning(false);
    }, [currentStyleTheme, themes]);

    const handleNavigation = (direction: 'next' | 'prev') => {
        if (isTransitioning || numThemes <= 1) return;
        setIsTransitioning(true);
        let newIndex = direction === 'next'
            ? (activeIndex + 1) % numThemes
            : (activeIndex - 1 + numThemes) % numThemes;
        setActiveIndex(newIndex);
        onThemeChange(themes[newIndex].id);
        setTimeout(() => setIsTransitioning(false), 500);
    };

    const goToNext = () => handleNavigation('next');
    const goToPrev = () => handleNavigation('prev');

    const handleCardClick = (index: number) => {
        if (isTransitioning || index === activeIndex || numThemes <= 1) return;
        // If clicking adjacent card, navigate smoothly
        const offset = index - activeIndex;
        const wrappedOffset = (offset + numThemes) % numThemes;
        if (wrappedOffset === 1) { // Clicked next card
             goToNext();
        } else if (wrappedOffset === numThemes - 1) { // Clicked previous card
             goToPrev();
        } else { // Clicked further away card (jump) - optional behavior
            setIsTransitioning(true);
            setActiveIndex(index);
            onThemeChange(themes[index].id);
            setTimeout(() => setIsTransitioning(false), 500);
        }
    };

    // --- REVISED getCardStyle Function ---
    const getCardStyle = (index: number): CSSProperties => {
        const offset = index - activeIndex;
        const totalItems = numThemes;

        // Calculate wrapped offset to determine relative position (-1 for prev, 0 for active, 1 for next, etc.)
        let wrappedOffset = offset;
         if (Math.abs(offset) > totalItems / 2) {
            wrappedOffset = offset > 0 ? offset - totalItems : offset + totalItems;
         }

        // --- Define style properties based on wrappedOffset ---

        // Configurable values for the look
        const cardWidthPercent = 50; // Width of one card slide (% of track width)
        const horizontalSpacingPercent = 35; // Horizontal distance between centers of adjacent cards (% of track width) - Adjust this!
        const scaleDown = 0.75; // How much to scale down adjacent cards
        const rotateYDeg = 35; // Angle for adjacent cards
        const baseOpacity = 0.2; // Opacity for adjacent cards

        // Calculate target center position for the card based on offset
        const targetCenterPercent = 50 + wrappedOffset * horizontalSpacingPercent;

        // Calculate translateX to position the *left edge* of the card
        const targetTranslateXPercent = targetCenterPercent - (cardWidthPercent / 2);

        // Determine scale, rotation, opacity, z-index
        let scale = scaleDown;
        let rotateY = wrappedOffset > 0 ? -rotateYDeg : rotateYDeg; // Rotate away from center
        let opacity = 0; // Default hidden
        let zIndex = 1; // Default behind

        // Apply specific styles for visible cards
        if (wrappedOffset === 0) { // Active card
            scale = 1;
            rotateY = 0;
            opacity = 1;
            zIndex = 10;
        } else if (Math.abs(wrappedOffset) === 1) { // Immediate neighbours (Prev/Next)
            opacity = baseOpacity;
            zIndex = 9;
             // Use calculated scale and rotateY
        } else if (Math.abs(wrappedOffset) === 2) { // Cards two steps away (optional visibility)
             scale = scaleDown * 0.8; // Even smaller
             opacity = baseOpacity * 0.4; // Even more faded (or 0)
             zIndex = 8;
             // Keep rotateY direction, maybe increase angle slightly? rotateY *= 1.2;
        }
        // Cards further away will use opacity = 0

        const transform = `translateX(${targetTranslateXPercent}%) scale(${scale}) rotateY(${rotateY}deg)`;

        return {
            transform,
            opacity,
            zIndex,
            // Set width explicitly here to match calculation basis
            width: `${cardWidthPercent}%`,
            // Transition is handled by the .carousel-card-slide class in CSS
        };
    };
    // --- End of REVISED getCardStyle Function ---


    return (
        <div className="theme-carousel-container theme-card-carousel-container">
            <h3 className="theme-carousel-title">Curate Your Vibe</h3>
            <div className="carousel-viewport">
                 <button
                    className="carousel-nav-button prev smooth-transition"
                    onClick={goToPrev}
                    aria-label="Previous theme"
                    disabled={isTransitioning}
                >
                    <ChevronLeft size={32} />
                </button>
                <button
                    className="carousel-nav-button next smooth-transition"
                    onClick={goToNext}
                    aria-label="Next theme"
                    disabled={isTransitioning}
                >
                    <ChevronRight size={32} />
                </button>

                {/* Track provides the 100% width context for translateX % */}
                <div className="carousel-track" style={{ height: '350px' }}>
                    {themes.map((theme, index) => (
                        <div
                            key={theme.id}
                            className={`carousel-card-slide ${index === activeIndex ? 'active' : ''}`}
                            style={getCardStyle(index)} // Apply dynamic styles
                            onClick={() => handleCardClick(index)}
                            role="button"
                            tabIndex={index === activeIndex ? 0 : -1}
                            onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? handleCardClick(index) : null}
                            aria-label={`Select ${theme.name} theme`}
                            aria-hidden={ getCardStyle(index).opacity === 0 }
                        >
                            <div className="carousel-card">
                                <img
                                    src={theme.imageUrl}
                                    alt={`${theme.name} Theme Preview`}
                                    className="carousel-card-image"
                                    loading="lazy"
                                />
                                <div className="carousel-card-overlay">
                                    <h4 className="carousel-card-name">{theme.name}</h4>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
             <div className="carousel-dots">
                {themes.map((_, index) => (
                    <button
                        key={index}
                        className={`carousel-dot ${index === activeIndex ? 'active' : ''}`}
                        onClick={() => handleCardClick(index)}
                        aria-label={`Go to theme ${index + 1}`}
                        disabled={isTransitioning}
                    />
                ))}
            </div>
        </div>
    );
};

export default ThemeCarousel;