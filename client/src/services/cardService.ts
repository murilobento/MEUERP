import api from './api';
import type { Card, CreateCardData, MoveCardData } from '../types';

export const cardService = {
    async list(columnId?: number): Promise<Card[]> {
        const params = columnId ? { columnId } : {};
        const response = await api.get('/cards', { params });
        return response.data;
    },

    async getById(id: number): Promise<Card> {
        const response = await api.get(`/cards/${id}`);
        return response.data;
    },

    async create(data: CreateCardData): Promise<Card> {
        const response = await api.post('/cards', data);
        return response.data;
    },

    async update(id: number, data: Partial<CreateCardData>): Promise<Card> {
        const response = await api.put(`/cards/${id}`, data);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        await api.delete(`/cards/${id}`);
    },

    async moveCard(cardId: number, data: MoveCardData): Promise<Card> {
        const response = await api.post(`/cards/${cardId}/move`, data);
        return response.data;
    }
};
