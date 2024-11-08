import React from 'react';
import './../../styles/output.css';
import './buttons-grid-container.css';
import { useIsMobile } from '../../hooks/useIsMobile';

type ButtonsGridContainerProps = {
    children: React.ReactNode;
    className?: string;
};

function NoteSelector({ children, className }: ButtonsGridContainerProps) {
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

export default NoteSelector;
