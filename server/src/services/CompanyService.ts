import { PrismaClient, Company } from '@prisma/client';

const prisma = new PrismaClient();

export class CompanyService {
    async getSettings(): Promise<Company> {
        // Tenta encontrar a primeira configuração
        let company = await prisma.company.findFirst();

        // Se não existir, cria uma padrão
        if (!company) {
            company = await prisma.company.create({
                data: {
                    name: 'Minha Empresa',
                    email: 'contato@empresa.com',
                },
            });
        }

        return company;
    }

    async updateSettings(data: Partial<Company>): Promise<Company> {
        const current = await this.getSettings();

        return prisma.company.update({
            where: { id: current.id },
            data,
        });
    }
}
