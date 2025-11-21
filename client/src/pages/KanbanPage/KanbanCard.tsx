import React from 'react';
import type { Card as CardType } from '../../types';

interface KanbanCardProps {
    card: CardType;
    onDragStart: (e: React.DragEvent, card: CardType) => void;
    onDragEnd: (e: React.DragEvent) => void;
    onClick: (card: CardType) => void;
}

const priorityColors = {
    LOW: '#64748b',
    MEDIUM: '#f59e0b',
    HIGH: '#f97316',
    URGENT: '#dc2626'
};

export const KanbanCard: React.FC<KanbanCardProps> = ({ card, onDragStart, onDragEnd, onClick }) => {
    const formatDate = (dateString?: string) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        const now = new Date();
        const isOverdue = date < now;

        return (
            <div className={`card-due-date ${isOverdue ? 'overdue' : ''}`}>
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
            className="kanban-card"
            draggable
            onDragStart={(e) => onDragStart(e, card)}
            onDragEnd={onDragEnd}
            onClick={() => onClick(card)}
            style={{ '--priority-color': priorityColors[card.priority] } as React.CSSProperties}
        >
            <div className="card-header">
                <h4 className="card-title">{card.title}</h4>
            </div>

            {card.description && (
                <p className="card-description">
                    {card.description.length > 100
                        ? `${card.description.substring(0, 100)}...`
                        : card.description}
                </p>
            )}

            <div className="card-footer">
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span className={`card-priority ${card.priority.toLowerCase()}`}>
                        {card.priority}
                    </span>
                    {card.dueDate && formatDate(card.dueDate)}
                </div>

                {card.assignedTo && (
                    <div className="card-assignee">
                        <div className="card-avatar" title={card.assignedTo.name}>
                            {getInitials(card.assignedTo.name)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
