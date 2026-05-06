import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeMap = {
    sm: 'h-8',    // Header footer small
    md: 'h-12',   // Standard dashboard
    lg: 'h-16',   // Landing nav
    xl: 'h-24',   // Auth cards
    xxl: 'h-32',  // CTA sections
  };

  const hSize = sizeMap[size];

  return (
    <Link to="/" className={`flex items-center no-underline ${className}`}>
      <img 
        src="/capzen-logo.png" 
        alt="CapZen" 
        className={`${hSize} w-auto object-contain transition-transform hover:scale-[1.02]`}
        style={{ filter: 'contrast(1.1)' }} // Make it pop a bit more
      />
    </Link>
  );
};
