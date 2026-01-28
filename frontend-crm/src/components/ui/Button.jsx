import React from 'react';
import './Button.css';

const Button = ({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    fullWidth = false
}) => {
    return (
        <button
            type={type}
            className={`btn btn-${variant} ${size !== 'md' ? `btn-${size}` : ''} ${fullWidth ? 'btn-full' : ''} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;
