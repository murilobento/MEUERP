import React, { useState, useEffect } from 'react';


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
        <div className="flex flex-col gap-2">
            {label && <label className="text-sm font-medium text-text-primary">{label}</label>}
            <div className="relative flex items-center">
                {icon && <span className="absolute left-4 text-text-tertiary flex items-center pointer-events-none">{icon}</span>}
                <input
                    {...rest}
                    type="text"
                    value={value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-3 py-2.5 text-sm border border-border rounded-md bg-bg-primary text-text-primary transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light ${icon ? 'pl-11' : ''} ${internalError ? 'border-danger focus:border-danger focus:ring-danger-light' : ''} ${className}`}
                />
            </div>
            {internalError && <span className="text-xs text-danger mt-1">{internalError}</span>}
        </div>
    );
};
