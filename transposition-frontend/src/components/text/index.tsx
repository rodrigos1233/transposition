import React, { CSSProperties } from 'react';
import { getNote } from '../../utils/notes';
import { useIsMobile } from '../../hooks/useIsMobile';

function Text({
    size,
    color,
    children,
    className,
    noWrap,
    style,
}: {
    size?: 'big' | 'small' | 'medium';
    color?: string;
    children: React.ReactNode;
    className?: string;
    noWrap?: boolean;
    style?: CSSProperties;
}) {
    const isMobile = useIsMobile();

    const sizingClasses = {
        desktop: {
            small: 'text-sm leading-3',
            medium: 'text-base leading-4',
            big: 'text-xl leading-5',
        },
        mobile: {
            small: 'text-xs leading-1',
            medium: 'text-sm leading-4',
            big: 'text-lg leading-5',
        },
    };

    const sizingClass =
        sizingClasses[isMobile ? 'mobile' : 'desktop'][size ?? 'medium'];

    return (
        <span
            className={`${sizingClass} ${color} ${className} ${
                noWrap ? 'text-nowrap' : ''
            }`}
            style={style}
        >
            {children}
        </span>
    );
}

export default Text;
