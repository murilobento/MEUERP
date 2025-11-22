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
            className="min-w-[300px] max-w-[300px] bg-bg-tertiary rounded-lg p-3 flex flex-col max-h-full border border-border"
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, column.id)}
        >
            <div className="flex justify-between items-center mb-3 p-2">
                <div className="flex items-center gap-2">
                    <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: column.color }}
                    />
                    <h3 className="text-sm font-semibold text-text-primary m-0 uppercase tracking-wide">{column.title}</h3>
                    <span className="bg-bg-primary px-2 py-0.5 rounded-full text-xs font-medium text-text-secondary border border-border">{column.cards.length}</span>
                </div>

                <div style={{ position: 'relative' }}>
                    <button
                        className="p-1 bg-transparent border-none cursor-pointer rounded text-text-tertiary transition-all hover:bg-bg-secondary hover:text-text-primary"
                        onClick={() => setShowMenu(!showMenu)}
                    >
                        ⋮
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 top-full bg-bg-primary border border-border rounded-md shadow-md p-1 z-10 min-w-[150px]">
                            <button
                                className="w-full p-2 bg-none border-none text-left cursor-pointer rounded text-sm text-text-primary transition-all hover:bg-bg-secondary"
                                onClick={() => {
                                    onEditColumn(column);
                                    setShowMenu(false);
                                }}
                            >
                                ✏️ Editar
                            </button>
                            <button
                                className="w-full p-2 bg-none border-none text-left cursor-pointer rounded text-sm text-danger transition-all hover:bg-danger-light"
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

            <div className="flex-1 overflow-y-auto flex flex-col gap-3 p-1 min-h-[50px] scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
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
                className="w-full p-2 bg-transparent border border-dashed border-border rounded-md text-text-secondary text-sm cursor-pointer transition-all mt-2 flex items-center justify-center gap-2 hover:bg-bg-primary hover:border-primary hover:text-primary"
                onClick={() => onAddCard(column.id)}
            >
                + Adicionar Card
            </button>
        </div>
    );
};
