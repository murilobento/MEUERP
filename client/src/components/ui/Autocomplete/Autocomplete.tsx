import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';


interface Option {
    value: string | number;
    label: string;
    subLabel?: string;
}

interface AutocompleteProps {
    options: Option[];
    value: string | number;
    onChange: (value: string | number) => void;
    placeholder?: string;
    icon?: React.ReactNode;
    className?: string;
    disabled?: boolean;
}

const Autocomplete: React.FC<AutocompleteProps> = ({
    options,
    value,
    onChange,
    placeholder = 'Selecione...',
    icon,
    className = '',
    disabled = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [displayValue, setDisplayValue] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const selectedOption = options.find(opt => opt.value === value);
        if (selectedOption) {
            setDisplayValue(selectedOption.label);
        } else {
            setDisplayValue('');
        }
    }, [value, options]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                // Reset search term to current value label if closed without selection
                const selectedOption = options.find(opt => opt.value === value);
                if (selectedOption) {
                    setSearchTerm('');
                    setDisplayValue(selectedOption.label);
                } else {
                    setSearchTerm('');
                    setDisplayValue('');
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [value, options]);

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (option.subLabel && option.subLabel.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setDisplayValue(e.target.value);
        setIsOpen(true);
        if (e.target.value === '') {
            onChange('');
        }
    };

    const handleSelect = (option: Option) => {
        onChange(option.value);
        setDisplayValue(option.label);
        setSearchTerm('');
        setIsOpen(false);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('');
        setDisplayValue('');
        setSearchTerm('');
    };

    const handleFocus = () => {
        setSearchTerm(''); // Clear search term on focus to show all or allow filtering
        setIsOpen(true);
    };

    return (
        <div className={`relative w-full ${className}`} ref={wrapperRef}>
            <div className="relative flex items-center">
                {icon && <span className="absolute left-3 text-text-tertiary pointer-events-none z-10">{icon}</span>}
                <input
                    type="text"
                    className="w-full px-3 py-2.5 text-sm border border-border rounded-md bg-bg-primary text-text-primary transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                    value={isOpen ? (searchTerm || displayValue) : displayValue}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    placeholder={placeholder}
                    disabled={disabled}
                    style={{ paddingLeft: icon ? '2.5rem' : '0.875rem' }}
                />
                {value && !disabled && (
                    <button type="button" className="absolute right-2 bg-transparent border-none text-text-tertiary cursor-pointer p-1 rounded-full flex items-center justify-center hover:bg-bg-tertiary hover:text-text-secondary" onClick={handleClear}>
                        <X size={14} />
                    </button>
                )}
            </div>

            {isOpen && !disabled && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-bg-primary border border-border rounded-md shadow-lg max-h-[200px] overflow-y-auto z-50 animate-fadeIn">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                            <div
                                key={option.value}
                                className={`px-4 py-2.5 text-sm text-text-primary cursor-pointer transition-colors hover:bg-bg-tertiary ${option.value === value ? 'bg-bg-tertiary' : ''}`}
                                onClick={() => handleSelect(option)}
                            >
                                <div>{option.label}</div>
                                {option.subLabel && (
                                    <div className="text-xs text-text-tertiary">
                                        {option.subLabel}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="p-4 text-center text-text-secondary text-sm">Nenhum resultado encontrado</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Autocomplete;
