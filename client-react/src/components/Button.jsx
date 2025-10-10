import React from 'react';

const Button = ({ onClick, children, type = "button", disabled = false, className = "" }) => (
    <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={className}
    >
        {children}
    </button>
);

export default Button;