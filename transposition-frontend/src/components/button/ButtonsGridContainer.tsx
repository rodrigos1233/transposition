import type { ReactNode } from 'react';
import './../../styles/output.css';
import './buttons-grid-container.css';
import { useIsMobile } from '../../hooks/useIsMobile';

type ButtonsGridContainerProps = {
  children: ReactNode;
  className?: string;
};

function ButtonsGridContainer({
  children,
  className,
}: ButtonsGridContainerProps) {
  const isMobile = useIsMobile();

  return (
    <div
      className={`grid-buttons-container ${
        isMobile ? 'grid-buttons-container--mobile' : ''
      } ${className ?? ''}`}
    >
      {children}
    </div>
  );
}

export default ButtonsGridContainer;
