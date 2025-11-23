import React, { useEffect } from 'react';
import { X } from 'lucide-react';


export interface SheetProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    headerRight?: React.ReactNode;
}

export const Sheet: React.FC<SheetProps> = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    headerRight
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

    const sizeClasses = {
        sm: 'md:w-[400px]',
        md: 'md:w-[600px]',
        lg: 'md:w-[800px]',
        xl: 'md:w-[1000px]',
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[1000] flex justify-end max-md:justify-center max-md:items-stretch animate-fadeIn" onClick={onClose}>
            <div
                className={`bg-bg-primary h-full shadow-[-4px_0_24px_rgba(0,0,0,0.15)] flex flex-col relative max-w-[100vw] animate-slideInRight max-md:w-full max-md:h-full max-md:max-w-full max-md:max-h-full max-md:min-w-0 max-md:m-0 max-md:rounded-none max-md:animate-slideInUp ${sizeClasses[size]}`}
                onClick={e => e.stopPropagation()}
            >
                <div className="p-4 border-b border-border flex justify-between items-center bg-bg-primary sticky top-0 z-10">
                    <div className="flex items-center gap-4 flex-1">
                        <h2 className="text-lg font-semibold text-text-primary m-0 md:text-xl">{title}</h2>
                        {headerRight}
                    </div>
                    <button
                        className="bg-transparent border-none text-text-secondary cursor-pointer p-2 rounded-md transition-all flex items-center justify-center min-w-[44px] min-h-[44px] md:min-w-[40px] md:min-h-[40px] hover:bg-bg-secondary hover:text-text-primary"
                        onClick={onClose}
                        aria-label="Fechar"
                    >
                        <X size={24} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};
