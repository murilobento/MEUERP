import React from 'react';
import './Switch.css';

interface SwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    id?: string;
    disabled?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({
    checked,
    onChange,
    label,
    id,
    disabled = false
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.checked);
    };

    return (
        <label className={`switch-container ${disabled ? 'disabled' : ''}`} htmlFor={id}>
            <div className="switch-wrapper">
                <input
                    type="checkbox"
                    id={id}
                    checked={checked}
                    onChange={handleChange}
                    disabled={disabled}
                    className="switch-input"
                />
                <span className="switch-slider"></span>
            </div>
            {label && <span className="switch-label">{label}</span>}
        </label>
    );
};
