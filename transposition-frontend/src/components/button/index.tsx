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
}
function Button({
    children,
    onClick,
    disabled,
    props,
    className,
    style
}: buttonProps) {
    const isMobile = useIsMobile();

    const sizingClasses = 'border-2 border-b-8 p-1 disabled:border-b-2';

    return (
        <button
            onClick={onClick}
            {...props}
            style={style}
            disabled={disabled ?? false}
            className={`${sizingClasses} border-neutral-800 rounded text-black hover:border-lime-300 disabled:border-lime-400 disabled:translate-y-0.5 ${className} transition-all relative z-0`}
        >
            <Text>{children}</Text>
        </button>
    );
}

export default Button;
