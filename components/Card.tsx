import { ReactNode, CSSProperties } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
}

export default function Card({ children, className = '', hover = false, onClick, style }: CardProps) {
  const hoverClass = hover ? 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer' : '';
  const clickableClass = onClick ? 'cursor-pointer' : '';
  
  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-6 ${hoverClass} ${clickableClass} ${className} animate-fade-in`}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
}

