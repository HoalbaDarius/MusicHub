import React, { useEffect, useRef } from 'react';
import './RapOverlayAnimation.css'; // Import the CSS file

interface RapOverlayAnimationProps {
  isActive: boolean;
  elementCount?: number; // Optional prop to control density
}

const RapOverlayAnimation: React.FC<RapOverlayAnimationProps> = ({
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

    // Create and add rap elements
    for (let i = 0; i < elementCount; i++) {
      const element = document.createElement('div');
      element.classList.add('rap-element'); // Base class

      // Randomly choose type - adjusted for three types
      const randomType = Math.random();
      let elementType: 'headphones' | 'disc' | 'cap';

      if (randomType < 0.33) {
        elementType = 'headphones';
      } else if (randomType < 0.66) {
        elementType = 'disc';
      } else {
        elementType = 'cap';
      }

      let elementSize: number;
      let fallDuration: number;
      let secondaryAnimationDuration: number;

      // Set properties based on elementType (matches Rock's if/else structure)
      if (elementType === 'headphones') {
        element.classList.add('rap-headphones');
        element.textContent = '🎧';
        elementSize = Math.random() * 8 + 20; // 20px - 28px
        fallDuration = Math.random() * 7 + 7; // 7s - 14s fall
        secondaryAnimationDuration = Math.random() * 4 + 4; // 4s - 8s swayBob cycle
      } else if (elementType === 'disc') {
        element.classList.add('rap-disc');
        element.textContent = '💽';
        elementSize = Math.random() * 6 + 22; // 22px - 28px
        fallDuration = Math.random() * 6 + 6; // 6s - 12s fall
        secondaryAnimationDuration = Math.random() * 3 + 1; // 1s - 4s spin cycle
      } else { // 'cap'
        element.classList.add('rap-cap');
        element.textContent = '🧢';
        elementSize = Math.random() * 10 + 18; // 18px - 28px
        fallDuration = Math.random() * 8 + 5; // 5s - 13s fall
        secondaryAnimationDuration = Math.random() * 5 + 3; // 3s - 8s tumble cycle
      }

      const positionX = Math.random() * 100; // 0-100% horizontal start
      const delay = Math.random() * 10; // 0-10s animation start delay (consistent range with Rock)

      // Apply styles to the element
      element.style.fontSize = `${elementSize}px`;
      element.style.left = `${positionX}%`;

      // Set individual animation durations and delays
      // Assumes CSS animation order: fallDown, secondaryAnimation
      // Format matches Rock example
      element.style.animationDuration = `${fallDuration}s, ${secondaryAnimationDuration}s`;
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

  // Return structure matches Rock example
  return (
    <div
      className="rap-overlay-container" // Use the Rap container class
      ref={containerRef}
      aria-hidden="true" /* Hide from screen readers as it's decorative */
    ></div>
  );
};

export default RapOverlayAnimation;