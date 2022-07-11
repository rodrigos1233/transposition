import React from 'react';
import { getNote } from '../../utils/notes';

function Button({
    children,
    onClick,
    disabled,
    props,
    className,
}: {
    children: any;
    props?: any;
    onClick?: any;
    disabled: boolean;
    className?: string;
}) {
    return (
        <button
            onClick={onClick}
            {...props}
            disabled={disabled ?? false}
            className={`border border-black rounded px-2 py-2 bg-white text-black hover:bg-amber-400 disabled:bg-amber-300 ${className} transition-all`}
        >
            {children}
        </button>
    );
}

export default Button;
