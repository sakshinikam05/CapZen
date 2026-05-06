import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeMap = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10',
    xl: 'h-14',
  };

  const hSize = sizeMap[size];

  return (
    <Link to="/" className={`flex items-center no-underline ${className}`}>
      <img 
        src="/capzen-logo.png" 
        alt="CapZen" 
        className={`${hSize} w-auto object-contain`}
      />
    </Link>
  );
};
