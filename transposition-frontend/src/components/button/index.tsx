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
            className={`border-4 border-b-8 border-neutral-800 rounded p-2 text-black hover:border-lime-300 disabled:border-lime-400 disabled:translate-y-1 disabled:border-b-4 ${className} transition-all`}
        >
            {children}
        </button>
    );
}

export default Button;
