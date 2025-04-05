import React, { useEffect, useRef } from 'react';
import './RockOverlayAnimation.css'; // Import the CSS file

interface RockOverlayAnimationProps {
  isActive: boolean;
  elementCount?: number; // Optional prop to control density
}

const RockOverlayAnimation: React.FC<RockOverlayAnimationProps> = ({
  isActive,
  elementCount = 40 // Default number of elements
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) {
      // Clear existing elements if deactivated
      if (containerRef.current) containerRef.current.innerHTML = '';
      return;
    }

    const container = containerRef.current;

    // Clear any previous elements before creating new ones
    container.innerHTML = '';

    // Create and add rock elements
    for (let i = 0; i < elementCount; i++) {
      const element = document.createElement('div');
      element.classList.add('rock-element'); // Base class

      const elementType = Math.random() > 0.5 ? 'lightning' : 'hand'; // Randomly choose type

      let elementSize: number;
      let fallDuration: number;
      let secondaryAnimationDuration: number;

      if (elementType === 'lightning') {
        element.classList.add('lightning-bolt');
        element.textContent = '⚡'; // Unicode lightning symbol
        elementSize = Math.random() * 15 + 15; // 15px - 30px
        fallDuration = Math.random() * 5 + 4; // 4s - 9s (Lightning is faster)
        secondaryAnimationDuration = Math.random() * 0.4 + 0.2; // 0.2s - 0.6s flash
      } else { // 'hand'
        element.classList.add('rock-hand');
        element.textContent = '🤘'; // Unicode rock hand symbol
        elementSize = Math.random() * 10 + 15; // 15px - 25px
        fallDuration = Math.random() * 8 + 7; // 7s - 15s (Hands fall slower)
        secondaryAnimationDuration = Math.random() * 5 + 4; // 4s - 9s tumble/drift
      }

      const positionX = Math.random() * 100; // 0-100% horizontal start
      const delay = Math.random() * 10; // 0-10s animation start delay

      // Apply styles to the element
      element.style.fontSize = `${elementSize}px`;
      element.style.left = `${positionX}%`;
      // Set individual animation durations and delays
      // CSS Format: animation: name1 duration1 timing1 delay1, name2 duration2 timing2 delay2, ...
      // We reference the names defined in CSS and override durations/delays here.
      // Note: Order matters if setting via style! Match the order in the CSS `animation` property.
       if (elementType === 'lightning') {
         // Assumes CSS animation order: fallDown, flash
         element.style.animationDuration = `${fallDuration}s, ${secondaryAnimationDuration}s`;
       } else {
         // Assumes CSS animation order: fallDown, tumbleAndDrift (or wildTumble via nth-child)
         element.style.animationDuration = `${fallDuration}s, ${secondaryAnimationDuration}s`;
       }
      element.style.animationDelay = `${delay}s`;


      container.appendChild(element);
    }

    // Clean up function when component unmounts or isActive becomes false
    return () => {
      if (container) container.innerHTML = '';
    };
    // Rerun effect if isActive changes or elementCount changes
  }, [isActive, elementCount]);

  // Don't render the container if not active
  if (!isActive) return null;

  return (
    <div
      className="rock-overlay-container"
      ref={containerRef}
      aria-hidden="true" /* Hide from screen readers as it's decorative */
    ></div>
  );
};

export default RockOverlayAnimation;