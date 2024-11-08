import React from 'react';
import { useNavigate } from 'react-router-dom';
import Text from '../text';

type ButtonsFlexContainerProps = {
    children: React.ReactNode;
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
