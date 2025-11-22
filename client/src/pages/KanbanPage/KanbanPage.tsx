import React, { useState, useEffect } from 'react';
import type { Board, Column, Card, CreateBoardData, CreateColumnData, CreateCardData, CardPriority } from '../../types';
import { boardService } from '../../services/boardService';
import { cardService } from '../../services/cardService';
import { KanbanColumn } from './KanbanColumn';
import './KanbanPage.css';

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
            <div className="kanban-page">
                <div style={{ textAlign: 'center', color: 'white', padding: '4rem' }}>
                    <h2>Carregando...</h2>
                </div>
            </div>
        );
    }

    if (!selectedBoard) {
        return (
            <div className="kanban-page">
                <div className="kanban-header">
                    <h1 className="kanban-title">Quadros Kanban</h1>
                    <button className="btn btn-primary" onClick={handleCreateBoard}>
                        + Novo Quadro
                    </button>
                </div>

                {boards.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📋</div>
                        <h3>Nenhum quadro criado</h3>
                        <p>Crie seu primeiro quadro para começar a organizar suas tarefas</p>
                        <button className="btn btn-primary" onClick={handleCreateBoard}>
                            Criar Primeiro Quadro
                        </button>
                    </div>
                ) : (
                    <div className="boards-grid">
                        {boards.map((board) => (
                            <div
                                key={board.id}
                                className="board-card"
                                onClick={() => loadBoard(board.id)}
                            >
                                <div className="board-card-header">
                                    <div className="board-title-wrapper">
                                        <div
                                            className="board-color-indicator"
                                            style={{ background: board.color }}
                                        />
                                        <h3 className="board-card-title">{board.title}</h3>
                                    </div>
                                    <div className="board-card-actions" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            className="btn-icon"
                                            onClick={() => handleEditBoard(board)}
                                            title="Editar"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className="btn-icon"
                                            onClick={() => handleDeleteBoard(board.id)}
                                            title="Excluir"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>

                                {board.description && (
                                    <p className="board-card-description">
                                        {board.description}
                                    </p>
                                )}

                                <div className="board-card-stats">
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flex: 1 }}>
                                        <span>📊 {board.columns.length} colunas</span>
                                        <span>📝 {board.columns.reduce((sum, col) => sum + col.cards.length, 0)} cards</span>
                                    </div>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        padding: '0.25rem 0.5rem',
                                        background: board.owner.id === JSON.parse(localStorage.getItem('user') || '{}').id
                                            ? 'var(--primary-color)'
                                            : 'var(--accent-color)',
                                        color: 'white',
                                        borderRadius: '4px',
                                        fontWeight: 500
                                    }}>
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
            </div>
        );
    }

    return (
        <div className="kanban-page">
            <div className="kanban-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setSelectedBoard(null)}
                    >
                        ← Voltar
                    </button>
                    <h2 className="kanban-title">{selectedBoard.title}</h2>
                </div>
                <div className="kanban-actions">
                    <button className="btn btn-secondary btn-sm" onClick={() => setShowMembersModal(true)}>
                        👥 Membros
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={handleCreateColumn}>
                        + Nova Coluna
                    </button>
                </div>
            </div>

            <div className="kanban-board">
                <div className="columns-container">
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
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">
                        {board ? 'Editar Quadro' : 'Novo Quadro'}
                    </h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Título</label>
                        <input
                            type="text"
                            className="input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            autoFocus
                            placeholder="Ex: Projeto Website"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Descrição</label>
                        <textarea
                            className="input"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            style={{ resize: 'vertical', minHeight: '80px' }}
                            placeholder="Breve descrição do projeto..."
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Cor de Identificação</label>
                        <div className="color-picker-grid">
                            {BOARD_COLORS.map((c) => (
                                <div
                                    key={c}
                                    className={`color-option ${color === c ? 'selected' : ''}`}
                                    style={{ background: c }}
                                    onClick={() => setColor(c)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary">
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
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">
                        {column ? 'Editar Coluna' : 'Nova Coluna'}
                    </h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Título</label>
                        <input
                            type="text"
                            className="input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            autoFocus
                            placeholder="Ex: Em Progresso"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Cor da Coluna</label>
                        <div className="color-picker-grid">
                            {COLUMN_COLORS.map((c) => (
                                <div
                                    key={c}
                                    className={`color-option ${color === c ? 'selected' : ''}`}
                                    style={{ background: c }}
                                    onClick={() => setColor(c)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary">
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
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">
                        {card ? 'Editar Card' : 'Novo Card'}
                    </h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Título</label>
                        <input
                            type="text"
                            className="input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            autoFocus
                            placeholder="O que precisa ser feito?"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Descrição</label>
                        <textarea
                            className="input"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            style={{ resize: 'vertical', minHeight: '100px' }}
                            placeholder="Detalhes adicionais..."
                        />
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Prioridade</label>
                            <select
                                className="select"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as CardPriority)}
                            >
                                <option value="LOW">Baixa</option>
                                <option value="MEDIUM">Média</option>
                                <option value="HIGH">Alta</option>
                                <option value="URGENT">Urgente</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Data de Vencimento</label>
                            <input
                                type="date"
                                className="input"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="modal-actions">
                        {onDelete && (
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={onDelete}
                                style={{ marginRight: 'auto' }}
                            >
                                Excluir
                            </button>
                        )}
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {card ? 'Salvar' : 'Criar'}
                        </button>
                    </div>
                </form>
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
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await boardService.inviteUser(board.id, email);
            setEmail('');
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
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Gerenciar Membros</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <div style={{ padding: '1.5rem' }}>
                    {/* Owner Section */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                            Proprietário
                        </h3>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.75rem',
                            background: 'var(--bg-secondary)',
                            borderRadius: '8px'
                        }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: 'var(--primary-color)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 600
                            }}>
                                {board.owner.name.charAt(0).toUpperCase()}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                                    {board.owner.name}
                                </div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                    {board.owner.email}
                                </div>
                            </div>
                            <span style={{
                                fontSize: '0.75rem',
                                padding: '0.25rem 0.5rem',
                                background: 'var(--primary-color)',
                                color: 'white',
                                borderRadius: '4px'
                            }}>
                                Dono
                            </span>
                        </div>
                    </div>

                    {/* Members Section */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                            Membros ({board.members.length})
                        </h3>
                        {board.members.length === 0 ? (
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', padding: '1rem', textAlign: 'center' }}>
                                Nenhum membro adicionado ainda
                            </p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {board.members.map((member) => (
                                    <div key={member.id} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        padding: '0.75rem',
                                        background: 'var(--bg-secondary)',
                                        borderRadius: '8px'
                                    }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            background: 'var(--accent-color)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontWeight: 600
                                        }}>
                                            {member.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                                                {member.name}
                                            </div>
                                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                                {member.email}
                                            </div>
                                        </div>
                                        <button
                                            className="btn-icon"
                                            onClick={() => handleRemove(member.id)}
                                            title="Remover"
                                            style={{ color: 'var(--danger-color)' }}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Invite Form */}
                    <form onSubmit={handleInvite}>
                        <div className="form-group">
                            <label className="form-label">Convidar por Email</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="email"
                                    className="input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="email@exemplo.com"
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? 'Convidando...' : 'Convidar'}
                                </button>
                            </div>
                            {error && (
                                <p style={{ color: 'var(--danger-color)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                                    {error}
                                </p>
                            )}
                        </div>
                    </form>
                </div>

                <div className="modal-actions">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};
