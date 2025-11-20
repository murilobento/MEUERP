import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import './Sheet.css';

interface SheetProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Sheet: React.FC<SheetProps> = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md'
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="sheet-overlay" onClick={onClose}>
            <div
                className={`sheet-content sheet-${size}`}
                onClick={e => e.stopPropagation()}
            >
                <div className="sheet-header">
                    <h2>{title}</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>
                <div className="sheet-body">
                    {children}
                </div>
            </div>
        </div>
    );
};
