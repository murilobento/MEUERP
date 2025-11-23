import React from 'react';
import { AlertTriangle } from 'lucide-react';


interface AlertDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
}

export const AlertDialog: React.FC<AlertDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    variant = 'danger'
}) => {
    if (!isOpen) return null;

    const variantClasses = {
        danger: 'bg-red-100 text-danger',
        warning: 'bg-amber-100 text-warning',
        info: 'bg-blue-100 text-primary',
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[1100] flex items-center justify-center animate-fadeIn">
            <div className="bg-bg-primary p-6 rounded-xl w-full max-w-[400px] shadow-[0_10px_25px_rgba(0,0,0,0.2)] text-center animate-scaleIn">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${variantClasses[variant]}`}>
                    <AlertTriangle size={24} />
                </div>

                <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
                <p className="text-text-secondary text-sm mb-6 leading-relaxed">{description}</p>

                <div className="flex gap-3 justify-center">
                    <button
                        className="flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all bg-bg-tertiary text-text-primary hover:bg-border-hover"
                        onClick={onClose}
                    >
                        {cancelText}
                    </button>
                    <button
                        className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all text-white ${variant === 'danger'
                                ? 'bg-danger hover:bg-red-600'
                                : 'bg-primary hover:bg-primary-hover'
                            }`}
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};
