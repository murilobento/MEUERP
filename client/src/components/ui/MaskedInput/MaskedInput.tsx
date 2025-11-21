import React, { useState, useEffect } from 'react';
import './MaskedInput.css';

export type MaskType = 'cpf' | 'cnpj' | 'phone' | 'cep' | 'none';

interface MaskedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    value: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
    maskType: MaskType;
    error?: string;
    icon?: React.ReactNode;
    label?: string;
    validate?: (value: string) => boolean;
}

// Mask functions
const maskCPF = (value: string): string => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
};

const maskCNPJ = (value: string): string => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
};

const maskPhone = (value: string): string => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4,5})(\d{4})$/, '$1-$2');
};

const maskCEP = (value: string): string => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{3})\d+?$/, '$1');
};

const applyMask = (value: string, maskType: MaskType): string => {
    switch (maskType) {
        case 'cpf':
            return maskCPF(value);
        case 'cnpj':
            return maskCNPJ(value);
        case 'phone':
            return maskPhone(value);
        case 'cep':
            return maskCEP(value);
        default:
            return value;
    }
};

export const MaskedInput: React.FC<MaskedInputProps> = ({
    value,
    onChange,
    onBlur,
    maskType,
    error,
    icon,
    label,
    validate,
    className = '',
    ...rest
}) => {
    const [internalError, setInternalError] = useState<string>('');

    useEffect(() => {
        setInternalError(error || '');
    }, [error]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const maskedValue = applyMask(e.target.value, maskType);
        onChange(maskedValue);

        // Clear error when user types
        if (internalError) {
            setInternalError('');
        }
    };

    const handleBlur = () => {
        if (validate && value) {
            const isValid = validate(value);
            if (!isValid) {
                setInternalError(getErrorMessage(maskType));
            }
        }

        if (onBlur) {
            onBlur();
        }
    };

    const getErrorMessage = (type: MaskType): string => {
        switch (type) {
            case 'cpf':
                return 'CPF inválido';
            case 'cnpj':
                return 'CNPJ inválido';
            case 'phone':
                return 'Telefone inválido';
            case 'cep':
                return 'CEP inválido';
            default:
                return 'Valor inválido';
        }
    };

    return (
        <div className="masked-input-wrapper">
            {label && <label className="masked-input-label">{label}</label>}
            <div className={`input-icon-wrapper ${internalError ? 'has-error' : ''}`}>
                {icon && <span className="input-icon">{icon}</span>}
                <input
                    {...rest}
                    type="text"
                    value={value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`input ${className}`}
                />
            </div>
            {internalError && <span className="input-error">{internalError}</span>}
        </div>
    );
};
