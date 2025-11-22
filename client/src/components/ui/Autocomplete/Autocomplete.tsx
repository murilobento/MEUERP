import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import './Autocomplete.css';

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
        <div className={`autocomplete-wrapper ${className}`} ref={wrapperRef}>
            <div className="autocomplete-input-container">
                {icon && <span className="autocomplete-icon">{icon}</span>}
                <input
                    type="text"
                    className="autocomplete-input"
                    value={isOpen ? (searchTerm || displayValue) : displayValue} // Show search term when open/typing, else display value
                    // Actually, better logic:
                    // When typing (isOpen), show what user types (searchTerm or displayValue if searchTerm empty?)
                    // Let's simplify:
                    // When open, we are editing.
                    // But if we just clicked, we might want to see the current value.
                    // Let's use a single controlled input.
                    // value={displayValue}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    placeholder={placeholder}
                    disabled={disabled}
                    style={{ paddingLeft: icon ? '2.5rem' : '0.875rem' }}
                />
                {value && !disabled && (
                    <button type="button" className="clear-btn" onClick={handleClear}>
                        <X size={14} />
                    </button>
                )}
            </div>

            {isOpen && !disabled && (
                <div className="autocomplete-dropdown">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                            <div
                                key={option.value}
                                className={`autocomplete-option ${option.value === value ? 'selected' : ''}`}
                                onClick={() => handleSelect(option)}
                            >
                                <div>{option.label}</div>
                                {option.subLabel && (
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                                        {option.subLabel}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="no-options">Nenhum resultado encontrado</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Autocomplete;
