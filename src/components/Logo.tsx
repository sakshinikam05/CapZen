import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeMap = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
    xxl: 'text-5xl',
  };

  const fontSize = sizeMap[size];

  return (
    <Link 
      to="/" 
      className={`inline-flex items-center no-underline select-none group ${className}`}
      style={{ 
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <span 
        className={`${fontSize} font-semibold tracking-tight text-slate-900 transition-opacity hover:opacity-80`}
        style={{ 
          letterSpacing: '-0.01em',
          lineHeight: 1
        }}
      >
        CapZen
      </span>
    </Link>
  );
};
