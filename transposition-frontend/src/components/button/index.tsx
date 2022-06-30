import React from 'react';

function Button({children, props, onClick}:{children: any, props?: any, onClick?: any}) {
    return (
        <button onClick={onClick} {...props}>{children}</button>
    );
}

export default Button;
