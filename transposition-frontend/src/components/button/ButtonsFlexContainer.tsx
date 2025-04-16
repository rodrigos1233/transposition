import type { ReactNode } from 'react';

type ButtonsFlexContainerProps = {
    children: ReactNode;
    wrap?: boolean;
};

function ButtonsFlexContainer({ children, wrap }: ButtonsFlexContainerProps) {
    return (
        <div className={`flex items-center ${wrap ? 'flex-wrap' : ''}`}>
            {children}
        </div>
    );
}

export default ButtonsFlexContainer;
