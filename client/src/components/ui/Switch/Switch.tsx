import React from 'react';


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
        <label className={`inline-flex items-center gap-3 cursor-pointer select-none ${disabled ? 'cursor-not-allowed opacity-60' : ''}`} htmlFor={id}>
            <div className="relative w-[44px] h-[24px]">
                <input
                    type="checkbox"
                    id={id}
                    checked={checked}
                    onChange={handleChange}
                    disabled={disabled}
                    className="sr-only peer"
                />
                <div className="absolute inset-0 cursor-pointer bg-border rounded-full transition-all duration-300 peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-primary-light"></div>
                <div className="absolute h-[18px] w-[18px] left-[3px] bottom-[3px] bg-white transition-all duration-300 rounded-full shadow-sm peer-checked:translate-x-[20px]"></div>
            </div>
            {label && <span className="text-sm text-text-primary font-medium">{label}</span>}
        </label>
    );
};
