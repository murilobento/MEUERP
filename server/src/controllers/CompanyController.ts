import { Request, Response } from 'express';
import { CompanyService } from '../services/CompanyService';

const companyService = new CompanyService();

export class CompanyController {
    async getSettings(req: Request, res: Response) {
        try {
            const settings = await companyService.getSettings();
            res.json(settings);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar configurações da empresa' });
        }
    }

    async updateSettings(req: Request, res: Response) {
        try {
            const settings = await companyService.updateSettings(req.body);
            res.json(settings);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao atualizar configurações da empresa' });
        }
    }
}
