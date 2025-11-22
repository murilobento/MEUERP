import React from 'react';
import type { Card as CardType } from '../../types';

interface KanbanCardProps {
    card: CardType;
    onDragStart: (e: React.DragEvent, card: CardType) => void;
    onDragEnd: (e: React.DragEvent) => void;
    onClick: (card: CardType) => void;
}

const priorityStyles = {
    LOW: 'bg-bg-secondary text-text-secondary border border-border',
    MEDIUM: 'bg-info-light text-info',
    HIGH: 'bg-warning-light text-warning',
    URGENT: 'bg-danger-light text-danger'
};

export const KanbanCard: React.FC<KanbanCardProps> = ({ card, onDragStart, onDragEnd, onClick }) => {
    const formatDate = (dateString?: string) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        const now = new Date();
        const isOverdue = date < now;

        return (
            <div className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-danger font-medium' : 'text-text-secondary'}`}>
                📅 {date.toLocaleDateString('pt-BR')}
            </div>
        );
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div
            className="bg-bg-primary border border-border rounded-md p-3 shadow-sm cursor-grab transition-all duration-200 relative hover:shadow-md hover:border-border-hover hover:-translate-y-[1px] active:cursor-grabbing active:opacity-50 active:shadow-lg"
            draggable
            onDragStart={(e) => onDragStart(e, card)}
            onDragEnd={onDragEnd}
            onClick={() => onClick(card)}
        >
            <div className="mb-2">
                <h4 className="text-sm font-medium text-text-primary m-0 leading-snug">{card.title}</h4>
            </div>

            {card.description && (
                <p className="text-xs text-text-secondary mb-3 leading-relaxed line-clamp-2 overflow-hidden">
                    {card.description}
                </p>
            )}

            <div className="flex justify-between items-center mt-3 pt-3 border-t border-border">
                <div className="flex gap-2 items-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${priorityStyles[card.priority]}`}>
                        {card.priority}
                    </span>
                    {card.dueDate && formatDate(card.dueDate)}
                </div>

                {card.assignedTo && (
                    <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-primary-light text-primary flex items-center justify-center text-[10px] font-semibold border-2 border-bg-primary" title={card.assignedTo.name}>
                            {getInitials(card.assignedTo.name)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
