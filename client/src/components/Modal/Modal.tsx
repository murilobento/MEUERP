import React, { useEffect } from 'react';
import { X } from 'lucide-react';


interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'md',
}) => {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden'; // Previne scroll no body
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-[400px]',
        md: 'max-w-[600px]',
        lg: 'max-w-[800px]',
        xl: 'max-w-[1100px]',
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] backdrop-blur-[4px] animate-fadeIn p-4 max-sm:p-0" onClick={onClose}>
            <div
                className={`bg-bg-secondary rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.2)] flex flex-col max-h-[90vh] w-full animate-slideUp border border-border max-sm:max-h-full max-sm:h-full max-sm:rounded-none ${sizeClasses[size]}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-5 border-b border-border flex items-center justify-between">
                    <h3 className="m-0 text-lg font-semibold text-text-primary">{title}</h3>
                    <button
                        className="bg-transparent border-none text-text-secondary cursor-pointer p-1 rounded-md transition-all flex items-center justify-center hover:bg-bg-tertiary hover:text-danger"
                        onClick={onClose}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1 text-text-primary">
                    {children}
                </div>

                {footer && (
                    <div className="p-5 border-t border-border flex justify-end gap-4 bg-bg-tertiary rounded-b-xl max-sm:rounded-none">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
