import React from 'react';
import { getNote } from '../../utils/notes';
import { useIsMobile } from '../../hooks/useIsMobile';
import Text from '../text';

type buttonProps = {
    children: any;
    props?: any;
    onClick?: any;
    disabled: boolean;
    className?: string;
    style?: any;
    colour?: 'lime' | 'red' | 'sky' | 'yellow' | 'purple';
};
function Button({
    children,
    onClick,
    disabled,
    props,
    className,
    style,
    colour,
}: buttonProps) {
    const isMobile = useIsMobile();

    const sizingClasses = 'border-2 border-b-8 p-1 disabled:border-b-2';
    const colourClasses = {
        lime: 'hover:border-lime-300 disabled:border-lime-400',
        red: 'hover:border-red-300 disabled:border-red-400',
        sky: 'hover:border-sky-300 disabled:border-sky-400',
        yellow: 'hover:border-yellow-300 disabled:border-yellow-400',
        purple: 'hover:border-purple-300 disabled:border-purple-400',
    };

    return (
        <button
            onClick={onClick}
            {...props}
            style={style}
            disabled={disabled ?? false}
            className={`${sizingClasses} border-neutral-800 rounded text-black ${
                colourClasses[colour ?? 'lime']
            } disabled:translate-y-0.5 ${className} transition-all relative z-0`}
        >
            <Text>{children}</Text>
        </button>
    );
}

export default Button;
