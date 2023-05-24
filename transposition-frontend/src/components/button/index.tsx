import React from 'react';
import { getNote } from '../../utils/notes';
import { useIsMobile } from '../../hooks/useIsMobile';
import Text from '../text';

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
    const isMobile = useIsMobile();

    const sizingClasses = isMobile
        ? 'border-2 border-b-8 p-1 disabled:border-b-2'
        : 'border-4 border-b-8 p-2 disabled:border-b-4';

    return (
        <button
            onClick={onClick}
            {...props}
            disabled={disabled ?? false}
            className={`${sizingClasses} border-neutral-800 rounded text-black hover:border-lime-300 disabled:border-lime-400 disabled:translate-y-1 ${className} transition-all`}
        >
            <Text>{children}</Text>
        </button>
    );
}

export default Button;
