import React, { useState, useEffect } from 'react';
import type { Board, Column, Card, CreateBoardData, CreateColumnData, CreateCardData, CardPriority } from '../../types';
import { boardService } from '../../services/boardService';
import { cardService } from '../../services/cardService';
import { userService } from '../../services/userService';
import { KanbanColumn } from './KanbanColumn';

const BOARD_COLORS = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
    '#f97316', '#f59e0b', '#10b981', '#06b6d4'
];

const COLUMN_COLORS = [
    '#64748b', '#6366f1', '#8b5cf6', '#ec4899',
    '#f43f5e', '#f97316', '#10b981', '#06b6d4'
];

export const KanbanPage: React.FC = () => {
    const [boards, setBoards] = useState<Board[]>([]);
    const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
    const [loading, setLoading] = useState(true);

    // Modals
    const [showBoardModal, setShowBoardModal] = useState(false);
    const [showColumnModal, setShowColumnModal] = useState(false);
    const [showCardModal, setShowCardModal] = useState(false);
    const [showMembersModal, setShowMembersModal] = useState(false);
    const [showInvitationsModal, setShowInvitationsModal] = useState(false);
    const [editingBoard, setEditingBoard] = useState<Board | null>(null);
    const [editingColumn, setEditingColumn] = useState<Column | null>(null);
    const [editingCard, setEditingCard] = useState<Card | null>(null);
    const [targetColumnId, setTargetColumnId] = useState<number | null>(null);

    // Drag and Drop
    const [draggedCard, setDraggedCard] = useState<Card | null>(null);

    useEffect(() => {
        loadBoards();
    }, []);

    const loadBoards = async () => {
        try {
            setLoading(true);
            const data = await boardService.list();
            setBoards(data);
        } catch (error) {
            console.error('Error loading boards:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadBoard = async (boardId: number) => {
        try {
            const board = await boardService.getById(boardId);
            setSelectedBoard(board);
        } catch (error) {
            console.error('Error loading board:', error);
        }
    };

    const handleCreateBoard = () => {
        setEditingBoard(null);
        setShowBoardModal(true);
    };

    const handleEditBoard = (board: Board) => {
        setEditingBoard(board);
        setShowBoardModal(true);
    };

    const handleSaveBoard = async (data: CreateBoardData) => {
        try {
            if (editingBoard) {
                await boardService.update(editingBoard.id, data);
            } else {
                await boardService.create(data);
            }
            await loadBoards();
            setShowBoardModal(false);
            setEditingBoard(null);
        } catch (error) {
            console.error('Error saving board:', error);
        }
    };

    const handleDeleteBoard = async (boardId: number) => {
        if (!confirm('Tem certeza que deseja excluir este board?')) return;

        try {
            await boardService.delete(boardId);
            await loadBoards();
            if (selectedBoard?.id === boardId) {
                setSelectedBoard(null);
            }
        } catch (error) {
            console.error('Error deleting board:', error);
        }
    };

    const handleCreateColumn = () => {
        if (!selectedBoard) return;
        setEditingColumn(null);
        setShowColumnModal(true);
    };

    const handleEditColumn = (column: Column) => {
        setEditingColumn(column);
        setShowColumnModal(true);
    };

    const handleSaveColumn = async (data: CreateColumnData) => {
        if (!selectedBoard) return;

        try {
            if (editingColumn) {
                await boardService.updateColumn(selectedBoard.id, editingColumn.id, data);
            } else {
                await boardService.createColumn(selectedBoard.id, data);
            }
            await loadBoard(selectedBoard.id);
            setShowColumnModal(false);
            setEditingColumn(null);
        } catch (error) {
            console.error('Error saving column:', error);
        }
    };

    const handleDeleteColumn = async (columnId: number) => {
        if (!selectedBoard) return;

        try {
            await boardService.deleteColumn(selectedBoard.id, columnId);
            await loadBoard(selectedBoard.id);
        } catch (error) {
            console.error('Error deleting column:', error);
        }
    };

    const handleAddCard = (columnId: number) => {
        setTargetColumnId(columnId);
        setEditingCard(null);
        setShowCardModal(true);
    };

    const handleEditCard = (card: Card) => {
        setEditingCard(card);
        setTargetColumnId(card.columnId);
        setShowCardModal(true);
    };

    const handleSaveCard = async (data: CreateCardData) => {
        try {
            if (editingCard) {
                await cardService.update(editingCard.id, data);
            } else {
                await cardService.create(data);
            }
            if (selectedBoard) {
                await loadBoard(selectedBoard.id);
            }
            setShowCardModal(false);
            setEditingCard(null);
            setTargetColumnId(null);
        } catch (error) {
            console.error('Error saving card:', error);
        }
    };

    const handleDeleteCard = async (cardId: number) => {
        if (!confirm('Tem certeza que deseja excluir este card?')) return;

        try {
            await cardService.delete(cardId);
            if (selectedBoard) {
                await loadBoard(selectedBoard.id);
            }
        } catch (error) {
            console.error('Error deleting card:', error);
        }
    };

    // Drag and Drop handlers
    const handleDragStart = (e: React.DragEvent, card: Card) => {
        setDraggedCard(card);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragEnd = () => {
        setDraggedCard(null);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = async (e: React.DragEvent, targetColumnId: number) => {
        e.preventDefault();

        if (!draggedCard || !selectedBoard) return;

        const targetColumn = selectedBoard.columns.find(col => col.id === targetColumnId);
        if (!targetColumn) return;

        try {
            // Calculate target position (end of column)
            const targetPosition = targetColumn.cards.length;

            await cardService.moveCard(draggedCard.id, {
                targetColumnId,
                targetPosition
            });

            await loadBoard(selectedBoard.id);
        } catch (error) {
            console.error('Error moving card:', error);
        }

        setDraggedCard(null);
    };

    if (loading) {
        return (
            <div className="p-6 h-full bg-bg-secondary flex flex-col overflow-hidden items-center justify-center">
                <div className="text-center text-text-secondary">
                    <h2 className="text-xl font-semibold">Carregando...</h2>
                </div>
            </div>
        );
    }

    if (!selectedBoard) {
        return (
            <div className="p-6 h-full bg-bg-secondary flex flex-col overflow-hidden">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
                    <h1 className="text-2xl font-semibold text-text-primary m-0">Quadros Kanban</h1>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-bg-tertiary text-text-primary rounded-md hover:bg-border-hover transition-colors flex items-center gap-2" onClick={() => setShowInvitationsModal(true)}>
                            📩 Convites
                        </button>
                        <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors flex items-center gap-2" onClick={handleCreateBoard}>
                            + Novo Quadro
                        </button>
                    </div>
                </div>

                {boards.length === 0 ? (
                    <div className="text-center py-16 px-8 bg-bg-primary border border-dashed border-border rounded-lg mt-8">
                        <div className="text-5xl mb-4 text-text-tertiary">📋</div>
                        <h3 className="text-lg font-semibold text-text-primary mb-2">Nenhum quadro criado</h3>
                        <p className="text-text-secondary mb-6">Crie seu primeiro quadro para começar a organizar suas tarefas</p>
                        <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors" onClick={handleCreateBoard}>
                            Criar Primeiro Quadro
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6 pb-8 overflow-y-auto">
                        {boards.map((board) => (
                            <div
                                key={board.id}
                                className="bg-bg-primary border border-border rounded-lg p-6 cursor-pointer transition-all duration-200 shadow-sm flex flex-col h-full hover:-translate-y-0.5 hover:shadow-md hover:border-primary group"
                                onClick={() => loadBoard(board.id)}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-3 h-3 rounded shrink-0"
                                            style={{ background: board.color }}
                                        />
                                        <h3 className="text-lg font-semibold text-text-primary m-0">{board.title}</h3>
                                    </div>
                                    <div className="flex gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            className="p-1 bg-transparent border-none cursor-pointer rounded text-text-tertiary transition-all hover:bg-bg-secondary hover:text-text-primary"
                                            onClick={() => handleEditBoard(board)}
                                            title="Editar"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className="p-1 bg-transparent border-none cursor-pointer rounded text-text-tertiary transition-all hover:bg-bg-secondary hover:text-danger"
                                            onClick={() => handleDeleteBoard(board.id)}
                                            title="Excluir"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>

                                {board.description && (
                                    <p className="text-text-secondary text-sm mb-auto leading-relaxed line-clamp-3 overflow-hidden">
                                        {board.description}
                                    </p>
                                )}

                                <div className="mt-6 pt-4 border-t border-border flex gap-4 text-sm text-text-tertiary items-center">
                                    <div className="flex gap-2 items-center flex-1">
                                        <span>📊 {board.columns.length} colunas</span>
                                        <span>📝 {board.columns.reduce((sum, col) => sum + col.cards.length, 0)} cards</span>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded font-medium text-white ${board.owner.id === JSON.parse(localStorage.getItem('user') || '{}').id
                                            ? 'bg-primary'
                                            : 'bg-secondary'
                                        }`}>
                                        {board.owner.id === JSON.parse(localStorage.getItem('user') || '{}').id ? '👑 Dono' : '👤 Membro'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {showBoardModal && (
                    <BoardModal
                        board={editingBoard}
                        onSave={handleSaveBoard}
                        onClose={() => {
                            setShowBoardModal(false);
                            setEditingBoard(null);
                        }}
                    />
                )}

                {showInvitationsModal && (
                    <InvitationsModal
                        onClose={() => setShowInvitationsModal(false)}
                        onUpdate={loadBoards}
                    />
                )}
            </div>
        );
    }

    return (
        <div className="p-6 h-full bg-bg-secondary flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
                <div className="flex items-center gap-4">
                    <button
                        className="px-3 py-1.5 text-xs bg-bg-tertiary text-text-primary rounded-md hover:bg-border-hover transition-colors"
                        onClick={() => setSelectedBoard(null)}
                    >
                        ← Voltar
                    </button>
                    <h2 className="text-2xl font-semibold text-text-primary m-0">{selectedBoard.title}</h2>
                </div>
                <div className="flex gap-3">
                    <button className="px-3 py-1.5 text-xs bg-bg-tertiary text-text-primary rounded-md hover:bg-border-hover transition-colors" onClick={() => setShowMembersModal(true)}>
                        👥 Membros
                    </button>
                    <button className="px-3 py-1.5 text-xs bg-bg-tertiary text-text-primary rounded-md hover:bg-border-hover transition-colors" onClick={handleCreateColumn}>
                        + Nova Coluna
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex gap-6 overflow-x-auto overflow-y-hidden h-full pb-4 items-start scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                    {selectedBoard.columns.map((column) => (
                        <KanbanColumn
                            key={column.id}
                            column={column}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                            onAddCard={handleAddCard}
                            onCardClick={handleEditCard}
                            onEditColumn={handleEditColumn}
                            onDeleteColumn={handleDeleteColumn}
                        />
                    ))}
                </div>
            </div>

            {showColumnModal && (
                <ColumnModal
                    column={editingColumn}
                    onSave={handleSaveColumn}
                    onClose={() => {
                        setShowColumnModal(false);
                        setEditingColumn(null);
                    }}
                />
            )}

            {showCardModal && targetColumnId && (
                <CardModal
                    card={editingCard}
                    columnId={targetColumnId}
                    onSave={handleSaveCard}
                    onDelete={editingCard ? () => handleDeleteCard(editingCard.id) : undefined}
                    onClose={() => {
                        setShowCardModal(false);
                        setEditingCard(null);
                        setTargetColumnId(null);
                    }}
                />
            )}

            {showMembersModal && (
                <MembersModal
                    board={selectedBoard}
                    onClose={() => setShowMembersModal(false)}
                    onUpdate={() => loadBoard(selectedBoard.id)}
                />
            )}
        </div>
    );
};

// Board Modal Component
interface BoardModalProps {
    board: Board | null;
    onSave: (data: CreateBoardData) => void;
    onClose: () => void;
}

const BoardModal: React.FC<BoardModalProps> = ({ board, onSave, onClose }) => {
    const [title, setTitle] = useState(board?.title || '');
    const [description, setDescription] = useState(board?.description || '');
    const [color, setColor] = useState(board?.color || BOARD_COLORS[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ title, description, color });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200" onClick={onClose}>
            <div className="bg-bg-primary rounded-lg p-6 max-w-[500px] w-[90%] max-h-[90vh] overflow-y-auto shadow-lg animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
                    <h2 className="text-xl font-semibold text-text-primary m-0">
                        {board ? 'Editar Quadro' : 'Novo Quadro'}
                    </h2>
                    <button className="bg-none border-none text-2xl text-text-tertiary cursor-pointer p-1 leading-none transition-colors hover:text-text-primary" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label className="block text-sm font-medium text-text-primary mb-2">Título</label>
                        <input
                            type="text"
                            className="w-full p-2.5 text-sm border border-border rounded-md bg-bg-primary text-text-primary transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            autoFocus
                            placeholder="Ex: Projeto Website"
                        />
                    </div>

                    <div className="mb-5">
                        <label className="block text-sm font-medium text-text-primary mb-2">Descrição</label>
                        <textarea
                            className="w-full p-2.5 text-sm border border-border rounded-md bg-bg-primary text-text-primary transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light min-h-[80px] resize-y"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            placeholder="Breve descrição do projeto..."
                        />
                    </div>

                    <div className="mb-5">
                        <label className="block text-sm font-medium text-text-primary mb-2">Cor de Identificação</label>
                        <div className="grid grid-cols-8 gap-2">
                            {BOARD_COLORS.map((c) => (
                                <div
                                    key={c}
                                    className={`w-8 h-8 rounded-md cursor-pointer transition-all border-2 hover:scale-110 ${color === c ? 'border-text-primary ring-2 ring-bg-primary' : 'border-transparent'}`}
                                    style={{ background: c }}
                                    onClick={() => setColor(c)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end mt-8 pt-4 border-t border-border">
                        <button type="button" className="px-4 py-2 bg-bg-tertiary text-text-primary rounded-md hover:bg-border-hover transition-colors" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors">
                            {board ? 'Salvar Alterações' : 'Criar Quadro'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Column Modal Component
interface ColumnModalProps {
    column: Column | null;
    onSave: (data: CreateColumnData) => void;
    onClose: () => void;
}

const ColumnModal: React.FC<ColumnModalProps> = ({ column, onSave, onClose }) => {
    const [title, setTitle] = useState(column?.title || '');
    const [color, setColor] = useState(column?.color || COLUMN_COLORS[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ title, color });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200" onClick={onClose}>
            <div className="bg-bg-primary rounded-lg p-6 max-w-[500px] w-[90%] max-h-[90vh] overflow-y-auto shadow-lg animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
                    <h2 className="text-xl font-semibold text-text-primary m-0">
                        {column ? 'Editar Coluna' : 'Nova Coluna'}
                    </h2>
                    <button className="bg-none border-none text-2xl text-text-tertiary cursor-pointer p-1 leading-none transition-colors hover:text-text-primary" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label className="block text-sm font-medium text-text-primary mb-2">Título</label>
                        <input
                            type="text"
                            className="w-full p-2.5 text-sm border border-border rounded-md bg-bg-primary text-text-primary transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            autoFocus
                            placeholder="Ex: Em Progresso"
                        />
                    </div>

                    <div className="mb-5">
                        <label className="block text-sm font-medium text-text-primary mb-2">Cor da Coluna</label>
                        <div className="grid grid-cols-8 gap-2">
                            {COLUMN_COLORS.map((c) => (
                                <div
                                    key={c}
                                    className={`w-8 h-8 rounded-md cursor-pointer transition-all border-2 hover:scale-110 ${color === c ? 'border-text-primary ring-2 ring-bg-primary' : 'border-transparent'}`}
                                    style={{ background: c }}
                                    onClick={() => setColor(c)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end mt-8 pt-4 border-t border-border">
                        <button type="button" className="px-4 py-2 bg-bg-tertiary text-text-primary rounded-md hover:bg-border-hover transition-colors" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors">
                            {column ? 'Salvar' : 'Criar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Card Modal Component
interface CardModalProps {
    card: Card | null;
    columnId: number;
    onSave: (data: CreateCardData) => void;
    onDelete?: () => void;
    onClose: () => void;
}

const CardModal: React.FC<CardModalProps> = ({ card, columnId, onSave, onDelete, onClose }) => {
    const [title, setTitle] = useState(card?.title || '');
    const [description, setDescription] = useState(card?.description || '');
    const [priority, setPriority] = useState<CardPriority>(card?.priority || 'MEDIUM');
    const [dueDate, setDueDate] = useState(
        card?.dueDate ? new Date(card.dueDate).toISOString().split('T')[0] : ''
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            title,
            description,
            columnId,
            priority,
            dueDate: dueDate || undefined
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200" onClick={onClose}>
            <div className="bg-bg-primary rounded-lg p-6 max-w-[500px] w-[90%] max-h-[90vh] overflow-y-auto shadow-lg animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
                    <h2 className="text-xl font-semibold text-text-primary m-0">
                        {card ? 'Editar Card' : 'Novo Card'}
                    </h2>
                    <button className="bg-none border-none text-2xl text-text-tertiary cursor-pointer p-1 leading-none transition-colors hover:text-text-primary" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label className="block text-sm font-medium text-text-primary mb-2">Título</label>
                        <input
                            type="text"
                            className="w-full p-2.5 text-sm border border-border rounded-md bg-bg-primary text-text-primary transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            autoFocus
                            placeholder="O que precisa ser feito?"
                        />
                    </div>

                    <div className="mb-5">
                        <label className="block text-sm font-medium text-text-primary mb-2">Descrição</label>
                        <textarea
                            className="w-full p-2.5 text-sm border border-border rounded-md bg-bg-primary text-text-primary transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light min-h-[100px] resize-y"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            placeholder="Detalhes adicionais..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-5">
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">Prioridade</label>
                            <select
                                className="w-full p-2.5 text-sm border border-border rounded-md bg-bg-primary text-text-primary transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as CardPriority)}
                            >
                                <option value="LOW">Baixa</option>
                                <option value="MEDIUM">Média</option>
                                <option value="HIGH">Alta</option>
                                <option value="URGENT">Urgente</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">Data de Vencimento</label>
                            <input
                                type="date"
                                className="w-full p-2.5 text-sm border border-border rounded-md bg-bg-primary text-text-primary transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end mt-8 pt-4 border-t border-border">
                        {onDelete && (
                            <button
                                type="button"
                                className="px-4 py-2 bg-danger text-white rounded-md hover:bg-red-600 transition-colors mr-auto"
                                onClick={onDelete}
                            >
                                Excluir
                            </button>
                        )}
                        <button type="button" className="px-4 py-2 bg-bg-tertiary text-text-primary rounded-md hover:bg-border-hover transition-colors" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors">
                            {card ? 'Salvar' : 'Criar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Invitations Modal Component
const InvitationsModal: React.FC<{ onClose: () => void; onUpdate: () => void }> = ({ onClose, onUpdate }) => {
    const [invitations, setInvitations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadInvitations();
    }, []);

    const loadInvitations = async () => {
        try {
            const data = await boardService.listPendingInvitations();
            setInvitations(data);
        } catch (error) {
            console.error('Error loading invitations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRespond = async (id: number, status: 'ACCEPTED' | 'REJECTED') => {
        try {
            await boardService.respondToInvitation(id, status);
            await loadInvitations();
            if (status === 'ACCEPTED') {
                onUpdate();
            }
        } catch (error) {
            console.error('Error responding to invitation:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200" onClick={onClose}>
            <div className="bg-bg-primary rounded-lg p-6 max-w-[500px] w-[90%] max-h-[90vh] overflow-y-auto shadow-lg animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
                    <h2 className="text-xl font-semibold text-text-primary m-0">Convites Pendentes</h2>
                    <button className="bg-none border-none text-2xl text-text-tertiary cursor-pointer p-1 leading-none transition-colors hover:text-text-primary" onClick={onClose}>×</button>
                </div>

                <div>
                    {loading ? (
                        <p className="text-text-secondary">Carregando...</p>
                    ) : invitations.length === 0 ? (
                        <p className="text-text-secondary text-center py-4">
                            Nenhum convite pendente.
                        </p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {invitations.map((invitation) => (
                                <div key={invitation.id} className="flex justify-between items-center p-4 bg-bg-secondary rounded-lg">
                                    <div>
                                        <h3 className="font-semibold text-text-primary mb-1">
                                            {invitation.board.title}
                                        </h3>
                                        <p className="text-sm text-text-secondary">
                                            Convidado por: {invitation.board.owner.name}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            className="px-3 py-1.5 text-xs bg-success text-white rounded-md hover:bg-green-600 transition-colors"
                                            onClick={() => handleRespond(invitation.id, 'ACCEPTED')}
                                        >
                                            Aceitar
                                        </button>
                                        <button
                                            className="px-3 py-1.5 text-xs bg-danger text-white rounded-md hover:bg-red-600 transition-colors"
                                            onClick={() => handleRespond(invitation.id, 'REJECTED')}
                                        >
                                            Recusar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Members Modal Component
interface MembersModalProps {
    board: Board;
    onClose: () => void;
    onUpdate: () => void;
}

const MembersModal: React.FC<MembersModalProps> = ({ board, onClose, onUpdate }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.length >= 3) {
                try {
                    const users = await userService.search(searchQuery);
                    setSearchResults(users);
                } catch (err) {
                    console.error('Error searching users:', err);
                }
            } else {
                setSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleInvite = async (userId: number) => {
        setError('');
        setLoading(true);

        try {
            await boardService.inviteUser(board.id, userId);
            setSearchQuery('');
            setSearchResults([]);
            alert('Convite enviado com sucesso!');
            onUpdate();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao convidar usuário');
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (userId: number) => {
        if (!confirm('Tem certeza que deseja remover este membro?')) return;

        try {
            await boardService.removeUser(board.id, userId);
            onUpdate();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao remover usuário');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200" onClick={onClose}>
            <div className="bg-bg-primary rounded-lg p-6 max-w-[500px] w-[90%] max-h-[90vh] overflow-y-auto shadow-lg animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
                    <h2 className="text-xl font-semibold text-text-primary m-0">Gerenciar Membros</h2>
                    <button className="bg-none border-none text-2xl text-text-tertiary cursor-pointer p-1 leading-none transition-colors hover:text-text-primary" onClick={onClose}>×</button>
                </div>

                <div>
                    {/* Invite Section */}
                    <div className="mb-8">
                        <h3 className="text-sm font-semibold text-text-primary mb-3">
                            Convidar Novo Membro
                        </h3>
                        <div className="mb-2">
                            <input
                                type="text"
                                className="w-full p-2.5 text-sm border border-border rounded-md bg-bg-primary text-text-primary transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Buscar usuário por nome ou email..."
                                disabled={loading}
                            />
                        </div>

                        {searchResults.length > 0 && (
                            <div className="mt-2 bg-bg-secondary rounded-lg max-h-[200px] overflow-y-auto border border-border">
                                {searchResults.map(user => (
                                    <div key={user.id} className={`p-3 border-b border-border flex justify-between items-center last:border-none ${loading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:bg-bg-tertiary'}`} onClick={() => !loading && handleInvite(user.id)}>
                                        <div>
                                            <div className="font-medium text-text-primary">{user.name}</div>
                                            <div className="text-xs text-text-secondary">{user.email}</div>
                                        </div>
                                        <button
                                            className="px-3 py-1.5 text-xs bg-primary text-white rounded-md hover:bg-primary-hover transition-colors disabled:opacity-50"
                                            disabled={loading}
                                        >
                                            {loading ? '...' : 'Convidar'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        {error && <p className="text-danger text-sm mt-2">{error}</p>}
                    </div>

                    {/* Owner Section */}
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-text-primary mb-3">
                            Proprietário
                        </h3>
                        <div className="flex items-center gap-3 p-3 bg-bg-secondary rounded-lg">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                                {board.owner.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <div className="font-medium text-text-primary">
                                    {board.owner.name}
                                </div>
                                <div className="text-sm text-text-secondary">
                                    {board.owner.email}
                                </div>
                            </div>
                            <span className="text-xs px-2 py-1 bg-primary text-white rounded">
                                Dono
                            </span>
                        </div>
                    </div>

                    {/* Members Section */}
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-text-primary mb-3">
                            Membros ({board.members.length})
                        </h3>
                        {board.members.length === 0 ? (
                            <p className="text-text-secondary text-sm p-4 text-center bg-bg-secondary rounded-lg">
                                Nenhum membro adicionado ainda
                            </p>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {board.members.map((member) => (
                                    <div key={member.id} className="flex items-center gap-3 p-3 bg-bg-secondary rounded-lg">
                                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white font-semibold">
                                            {member.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-text-primary">
                                                {member.name}
                                            </div>
                                            <div className="text-sm text-text-secondary">
                                                {member.email}
                                            </div>
                                        </div>
                                        {board.owner.id === JSON.parse(localStorage.getItem('user') || '{}').id && (
                                            <button
                                                className="p-1 bg-transparent border-none cursor-pointer rounded text-danger transition-all hover:bg-danger/10"
                                                onClick={() => handleRemove(member.id)}
                                                title="Remover"
                                            >
                                                🗑️
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
