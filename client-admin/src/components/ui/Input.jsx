import React from 'react';
import './Input.css';

const Input = ({
    label,
    type = 'text',
    name,
    value,
    onChange,
    placeholder,
    required = false,
    error,
    ...rest
}) => {
    return (
        <div className="input-group">
            {label && <label className="input-label" htmlFor={name}>{label}</label>}
            <input
                id={name || label}
                type={type}
                name={name || label}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className={`input-field ${error ? 'input-error' : ''}`}
                {...rest}
            />
            {error && <span className="input-error-msg">{error}</span>}
        </div>
    );
};

export default Input;
