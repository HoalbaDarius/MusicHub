import React, { useEffect, useRef } from 'react';
import './SakuraAnimation.css';

interface SakuraAnimationProps {
  isActive: boolean;
}

const SakuraAnimation: React.FC<SakuraAnimationProps> = ({ isActive }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;
    
    const container = containerRef.current;
    const petalsCount = 30; // Number of petals
    
    // Clear any existing petals
    container.innerHTML = '';
    
    // Create and add petals
    for (let i = 0; i < petalsCount; i++) {
      const petal = document.createElement('div');
      petal.className = 'sakura-petal';
      
      // Create random petal properties
      const size = Math.random() * 10 + 5; // 5-15px
      const positionX = Math.random() * 100; // 0-100%
      const delay = Math.random() * 10; // 0-10s
      const duration = Math.random() * 10 + 10; // 10-20s
      const rotation = Math.random() * 360; // 0-360deg
      
      // Apply styles to the petal
      petal.style.width = `${size}px`;
      petal.style.height = `${size}px`;
      petal.style.left = `${positionX}%`;
      petal.style.animationDelay = `${delay}s`;
      petal.style.animationDuration = `${duration}s`;
      petal.style.transform = `rotate(${rotation}deg)`;
      
      container.appendChild(petal);
    }
    
    // Clean up function
    return () => {
      if (container) container.innerHTML = '';
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="sakura-container" ref={containerRef}></div>
  );
};

export default SakuraAnimation;
