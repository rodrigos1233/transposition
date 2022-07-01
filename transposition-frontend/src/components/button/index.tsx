import React from 'react';

function Button({children, props, onClick, disabled}:{children: any, props?: any, onClick?: any, disabled: boolean}) {
    return (
        <button onClick={onClick} {...props} disabled={disabled ?? false}>{children}</button>
    );
}

export default Button;
