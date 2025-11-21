import React, { useState } from 'react';
import type { Column as ColumnType, Card as CardType } from '../../types';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
    column: ColumnType;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent, columnId: number) => void;
    onDragStart: (e: React.DragEvent, card: CardType) => void;
    onDragEnd: (e: React.DragEvent) => void;
    onAddCard: (columnId: number) => void;
    onCardClick: (card: CardType) => void;
    onEditColumn: (column: ColumnType) => void;
    onDeleteColumn: (columnId: number) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
    column,
    onDragOver,
    onDrop,
    onDragStart,
    onDragEnd,
    onAddCard,
    onCardClick,
    onEditColumn,
    onDeleteColumn
}) => {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div
            className="kanban-column"
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, column.id)}
        >
            <div className="column-header">
                <div className="column-title-wrapper">
                    <div
                        className="column-color-dot"
                        style={{ background: column.color }}
                    />
                    <h3 className="column-title">{column.title}</h3>
                    <span className="column-count">{column.cards.length}</span>
                </div>

                <div style={{ position: 'relative' }}>
                    <button
                        className="btn-icon"
                        onClick={() => setShowMenu(!showMenu)}
                    >
                        ⋮
                    </button>

                    {showMenu && (
                        <div className="column-menu-dropdown">
                            <button
                                className="column-menu-item"
                                onClick={() => {
                                    onEditColumn(column);
                                    setShowMenu(false);
                                }}
                            >
                                ✏️ Editar
                            </button>
                            <button
                                className="column-menu-item delete"
                                onClick={() => {
                                    if (confirm('Tem certeza que deseja excluir esta coluna?')) {
                                        onDeleteColumn(column.id);
                                    }
                                    setShowMenu(false);
                                }}
                            >
                                🗑️ Excluir
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="cards-list">
                {column.cards.map((card) => (
                    <KanbanCard
                        key={card.id}
                        card={card}
                        onDragStart={onDragStart}
                        onDragEnd={onDragEnd}
                        onClick={onCardClick}
                    />
                ))}
            </div>

            <button
                className="add-card-btn"
                onClick={() => onAddCard(column.id)}
            >
                + Adicionar Card
            </button>
        </div>
    );
};
