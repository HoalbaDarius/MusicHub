import React, { useEffect, useRef } from 'react';
import './TrapOverlayAnimation.css'; // Import the CSS

interface TrapOverlayAnimationProps {
  isActive: boolean;
  elementCount?: number; // Control density
}

const TrapOverlayAnimation: React.FC<TrapOverlayAnimationProps> = ({
  isActive,
  elementCount = 50 // Adjust density as needed
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
      element.classList.add('trap-element');

      // More money than diamonds usually fits the theme
      const elementType = Math.random() > 0.3 ? 'money' : 'diamond';

      let elementSize: number;
      let fallDuration: number;
      let secondaryAnimationDuration: number; // For spin or glint

      const positionX = Math.random() * 100;
      // Slightly less delay variation for a more 'sheet' like rain
      const delay = Math.random() * 6;

      if (elementType === 'money') {
        const isBill = Math.random() > 0.5; // Choose between bill or sign
        if (isBill) {
            element.classList.add('trap-money-bill');
            element.textContent = '💵';
            elementSize = Math.random() * 10 + 20; // 20px - 30px
        } else {
            element.classList.add('trap-money-sign');
            element.textContent = '$';
             elementSize = Math.random() * 8 + 18; // 18px - 26px
             // Randomly add purple glow to some dollar signs
             if (Math.random() < 0.15) { // 15% chance
                 element.classList.add('purple-glow');
             }
        }
        fallDuration = Math.random() * 5 + 4; // 4s - 9s (Relatively fast fall)
        secondaryAnimationDuration = Math.random() * 4 + 2; // 2s - 6s spin duration

        // CSS animation order: fallTrap, spinFall
        element.style.animationDuration = `${fallDuration}s, ${secondaryAnimationDuration}s`;

      } else { // 'diamond'
        element.classList.add('trap-diamond');
        element.textContent = '💎';
        elementSize = Math.random() * 8 + 16; // 16px - 24px
        fallDuration = Math.random() * 6 + 6; // 6s - 12s (Diamonds fall slightly slower/floatier)
        secondaryAnimationDuration = Math.random() * 1 + 0.5; // 0.5s - 1.5s glint cycle

        // CSS animation order: fallTrap, glint
        element.style.animationDuration = `${fallDuration}s, ${secondaryAnimationDuration}s`;

         // Randomly add purple tint to some diamonds
         if (Math.random() < 0.2) { // 20% chance
            element.classList.add('purple-tint');
            // Adjust glint speed for tinted diamonds maybe?
            // element.style.animationDuration = `${fallDuration}s, ${secondaryAnimationDuration * 1.5}s`;
         }
      }

      element.style.fontSize = `${elementSize}px`;
      element.style.left = `${positionX}%`;
      element.style.animationDelay = `${delay}s`; // Apply the random delay

      container.appendChild(element);
    }

    return () => {
      if (container) container.innerHTML = '';
    };
  }, [isActive, elementCount]);

  if (!isActive) return null;

  return (
    <div
      className="trap-overlay-container"
      ref={containerRef}
      aria-hidden="true"
    ></div>
  );
};

export default TrapOverlayAnimation;