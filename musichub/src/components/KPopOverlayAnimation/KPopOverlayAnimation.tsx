import React, { useEffect, useRef } from 'react';
import './KPopOverlayAnimation.css'; // Import the CSS

interface KPopOverlayAnimationProps {
  isActive: boolean;
  elementCount?: number; // Control density
}

// Define a K-pop inspired color palette
const kpopColors = [
  '#FFC0CB', // Pink
  '#FFB6C1', // LightPink
  '#FF69B4', // HotPink
  '#DB7093', // PaleVioletRed
  '#ADD8E6', // LightBlue
  '#AFEEEE', // PaleTurquoise
  '#E0FFFF', // LightCyan
  '#FFFACD', // LemonChiffon
  '#FFD700', // Gold
  '#E6E6FA', // Lavender
  '#D8BFD8', // Thistle
];

// Possible star characters
const starChars = ['⭐', '✨', '✦', '✧'];

const KPopOverlayAnimation: React.FC<KPopOverlayAnimationProps> = ({
  isActive,
  elementCount = 45 // Adjust default count for desired density
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) {
      if (containerRef.current) containerRef.current.innerHTML = '';
      return;
    }

    const container = containerRef.current;
    container.innerHTML = ''; // Clear previous elements

    for (let i = 0; i < elementCount; i++) {
      const element = document.createElement('div');
      element.classList.add('kpop-element');

      const elementType = Math.random() > 0.4 ? 'star' : 'mic'; // More stars than mics

      let elementSize: number;
      let fallDuration: number;
      let secondaryAnimationDuration: number;
      let tertiaryAnimationDuration: number | null = null; // For star's 3rd animation

      const positionX = Math.random() * 100;
      const delay = Math.random() * 12; // Spread out start times

      if (elementType === 'star') {
        const starChar = starChars[Math.floor(Math.random() * starChars.length)];
        const starColor = kpopColors[Math.floor(Math.random() * kpopColors.length)];

        element.classList.add('kpop-star');
        element.textContent = starChar;
        element.style.color = starColor;
        // Add color to the glow effect
        element.style.textShadow = `0 0 4px #fff, 0 0 8px ${starColor}, 0 0 12px ${starColor}`;

        elementSize = Math.random() * 10 + 12; // 12px - 22px
        fallDuration = Math.random() * 10 + 10; // 10s - 20s (Slower fall)
        secondaryAnimationDuration = Math.random() * 8 + 6; // 6s - 14s floatDrift
        tertiaryAnimationDuration = Math.random() * 2 + 1.5; // 1.5s - 3.5s twinkle

         // CSS animation order: fallGently, floatDrift, twinkle
         element.style.animationDuration = `${fallDuration}s, ${secondaryAnimationDuration}s, ${tertiaryAnimationDuration}s`;

      } else { // 'mic'
        element.classList.add('kpop-mic');
        element.textContent = '🎤';

        elementSize = Math.random() * 8 + 14; // 14px - 22px
        fallDuration = Math.random() * 8 + 9;  // 9s - 17s
        secondaryAnimationDuration = Math.random() * 4 + 3; // 3s - 7s bobbing

        // CSS animation order: fallGently, bobbing
        element.style.animationDuration = `${fallDuration}s, ${secondaryAnimationDuration}s`;
      }

      element.style.fontSize = `${elementSize}px`;
      element.style.left = `${positionX}%`;
      element.style.animationDelay = `${delay}s`; // Apply the random delay to all animations

      // Apply random horizontal drift direction for stars initially (optional variation)
      if(elementType === 'star' && Math.random() > 0.5) {
         // element.style.animationDirection = 'normal, reverse, normal'; // Make some drift left first
      }


      container.appendChild(element);
    }

    return () => {
      if (container) container.innerHTML = '';
    };
  }, [isActive, elementCount]);

  if (!isActive) return null;

  return (
    <div
      className="kpop-overlay-container"
      ref={containerRef}
      aria-hidden="true"
    ></div>
  );
};

export default KPopOverlayAnimation;