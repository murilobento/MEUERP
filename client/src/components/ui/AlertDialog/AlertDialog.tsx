import React from 'react';
import { AlertTriangle } from 'lucide-react';
import './AlertDialog.css';

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

    return (
        <div className="alert-dialog-overlay">
            <div className="alert-dialog-content">
                <div className={`alert-icon-wrapper variant-${variant}`}>
                    <AlertTriangle size={24} />
                </div>

                <h3 className="alert-title">{title}</h3>
                <p className="alert-description">{description}</p>

                <div className="alert-actions">
                    <button className="btn btn-secondary" onClick={onClose}>
                        {cancelText}
                    </button>
                    <button
                        className={`btn btn-${variant === 'danger' ? 'danger' : 'primary'}`}
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
