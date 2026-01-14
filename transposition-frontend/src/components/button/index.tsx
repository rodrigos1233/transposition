import React, { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import Text from '../text';

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  colour?: 'emerald' | 'red' | 'sky' | 'amber' | 'purple';
};

function Button({
  children,
  href,
  onClick,
  disabled = false,
  className,
  style,
  colour = 'emerald',
}: ButtonProps) {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    if (onClick) onClick(e);
    if (href && !e.defaultPrevented) {
      e.preventDefault();
      navigate(href);
    }
  };

  // Keep original sizing for proper grid layout
  const baseClasses = 'border-2 border-b-8 p-1 disabled:border-b-4 font-medium';

  // Color classes with strong selected states that work on both light and dark backgrounds
  const colourClasses = {
    emerald:
      'border-neutral-700 hover:border-emerald-400 disabled:border-emerald-500 disabled:bg-emerald-200',
    red: 'border-neutral-700 hover:border-red-400 disabled:border-red-500 disabled:bg-red-200',
    sky: 'border-neutral-700 hover:border-sky-400 disabled:border-sky-500 disabled:bg-sky-200',
    amber:
      'border-neutral-700 hover:border-amber-400 disabled:border-amber-500 disabled:bg-amber-200',
    purple:
      'border-neutral-700 hover:border-purple-400 disabled:border-purple-500 disabled:bg-purple-200',
  };

  // Focus ring colors that match the button color scheme
  const focusRingClasses = {
    emerald: 'focus:ring-emerald-500',
    red: 'focus:ring-red-500',
    sky: 'focus:ring-sky-500',
    amber: 'focus:ring-amber-500',
    purple: 'focus:ring-purple-500',
  };

  const combinedClasses = `${baseClasses} active:translate-y-0.5 active:border-b-2 rounded text-neutral-800 ${
    colourClasses[colour]
  } ${
    disabled ? 'cursor-not-allowed disabled:translate-y-0.5' : 'cursor-pointer'
  } ${className ?? ''} transition-all duration-100 ease-out relative z-0 focus:outline-none focus:ring-2 ${focusRingClasses[colour]} focus:ring-offset-1`;

  const buttonElement = (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={combinedClasses}
      style={style}
    >
      <Text>{children}</Text>
    </button>
  );

  return href ? (
    <a
      href={href}
      onClick={(e) => e.preventDefault()}
      role="button"
      style={{ textDecoration: 'none' }}
    >
      {buttonElement}
    </a>
  ) : (
    buttonElement
  );
}

export default Button;
