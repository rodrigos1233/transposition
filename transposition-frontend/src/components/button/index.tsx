import React from 'react';
import { useNavigate } from 'react-router-dom';
import Text from '../text';

type buttonProps = {
    children: any;
    href?: string;
    onClick?: any;
    disabled?: boolean;
    className?: string;
    style?: any;
    colour?: 'lime' | 'red' | 'sky' | 'yellow' | 'purple';
};

function Button({
    children,
    href,
    onClick,
    disabled = false,
    className,
    style,
    colour = 'lime',
}: buttonProps) {
    const navigate = useNavigate();

    const handleClick = (e: {
        preventDefault: () => void;
        defaultPrevented: any;
    }) => {
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

    const sizingClasses = 'border-2 border-b-8 p-1 disabled:border-b-2';
    const colourClasses = {
        lime: 'hover:border-lime-300 disabled:border-lime-400',
        red: 'hover:border-red-300 disabled:border-red-400',
        sky: 'hover:border-sky-300 disabled:border-sky-400',
        yellow: 'hover:border-yellow-300 disabled:border-yellow-400',
        purple: 'hover:border-purple-300 disabled:border-purple-400',
    };

    const combinedClasses = `${sizingClasses} border-neutral-800 rounded text-black ${
        colourClasses[colour]
    } ${
        disabled ? 'cursor-not-allowed disabled:translate-y-0.5' : ''
    } ${className} transition-all relative z-0`;

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
