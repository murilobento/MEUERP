import api from './api';
import type { Board, CreateBoardData, CreateColumnData } from '../types';

export const boardService = {
    async list(): Promise<Board[]> {
        const response = await api.get('/boards');
        return response.data;
    },

    async getById(id: number): Promise<Board> {
        const response = await api.get(`/boards/${id}`);
        return response.data;
    },

    async create(data: CreateBoardData): Promise<Board> {
        const response = await api.post('/boards', data);
        return response.data;
    },

    async update(id: number, data: Partial<CreateBoardData>): Promise<Board> {
        const response = await api.put(`/boards/${id}`, data);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        await api.delete(`/boards/${id}`);
    },

    // Member operations
    async inviteUser(boardId: number, userId: number) {
        const response = await api.post(`/boards/${boardId}/members`, { userId });
        return response.data;
    },

    async removeUser(boardId: number, userId: number) {
        const response = await api.delete(`/boards/${boardId}/members/${userId}`);
        return response.data;
    },

    // Invitation operations
    async listPendingInvitations() {
        const response = await api.get('/invitations');
        return response.data;
    },

    async respondToInvitation(invitationId: number, status: 'ACCEPTED' | 'REJECTED') {
        const response = await api.put(`/invitations/${invitationId}/respond`, { status });
        return response.data;
    },

    // Column operations
    async createColumn(boardId: number, data: CreateColumnData) {
        const response = await api.post(`/boards/${boardId}/columns`, data);
        return response.data;
    },

    async updateColumn(boardId: number, columnId: number, data: Partial<CreateColumnData>) {
        const response = await api.put(`/boards/${boardId}/columns/${columnId}`, data);
        return response.data;
    },

    async deleteColumn(boardId: number, columnId: number): Promise<void> {
        await api.delete(`/boards/${boardId}/columns/${columnId}`);
    },

    async reorderColumns(boardId: number, columnOrders: { id: number; position: number }[]) {
        const response = await api.post(`/boards/${boardId}/columns/reorder`, { columnOrders });
        return response.data;
    }
};
