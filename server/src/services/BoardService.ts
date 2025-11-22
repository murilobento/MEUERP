import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class BoardService {
    async list(userId: number) {
        return await prisma.board.findMany({
            where: {
                OR: [
                    { ownerId: userId },
                    { members: { some: { id: userId } } }
                ]
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true
                    }
                },
                members: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true
                    }
                },
                columns: {
                    orderBy: { position: 'asc' },
                    include: {
                        cards: {
                            orderBy: { position: 'asc' },
                            include: {
                                assignedTo: {
                                    select: {
                                        id: true,
                                        name: true,
                                        email: true,
                                        avatar: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async getById(id: number) {
        return await prisma.board.findUnique({
            where: { id },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true
                    }
                },
                members: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true
                    }
                },
                columns: {
                    orderBy: { position: 'asc' },
                    include: {
                        cards: {
                            orderBy: { position: 'asc' },
                            include: {
                                assignedTo: {
                                    select: {
                                        id: true,
                                        name: true,
                                        email: true,
                                        avatar: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    async create(userId: number, data: { title: string; description?: string; color?: string }) {
        return await prisma.board.create({
            data: {
                ...data,
                ownerId: userId
            },
            include: {
                columns: true
            }
        });
    }

    async update(id: number, data: { title?: string; description?: string; color?: string }) {
        return await prisma.board.update({
            where: { id },
            data,
            include: {
                columns: true
            }
        });
    }

    async delete(id: number) {
        return await prisma.board.delete({
            where: { id }
        });
    }

    async inviteUser(boardId: number, email: string) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) throw new Error('User not found');

        return await prisma.board.update({
            where: { id: boardId },
            data: {
                members: {
                    connect: { id: user.id }
                }
            },
            include: { members: true }
        });
    }

    async removeUser(boardId: number, userId: number) {
        return await prisma.board.update({
            where: { id: boardId },
            data: {
                members: {
                    disconnect: { id: userId }
                }
            },
            include: { members: true }
        });
    }

    // Column operations
    async createColumn(boardId: number, data: { title: string; color?: string }) {
        const maxPosition = await prisma.column.findFirst({
            where: { boardId },
            orderBy: { position: 'desc' },
            select: { position: true }
        });

        return await prisma.column.create({
            data: {
                ...data,
                boardId,
                position: (maxPosition?.position ?? -1) + 1
            }
        });
    }

    async updateColumn(columnId: number, data: { title?: string; color?: string }) {
        return await prisma.column.update({
            where: { id: columnId },
            data
        });
    }

    async deleteColumn(columnId: number) {
        return await prisma.column.delete({
            where: { id: columnId }
        });
    }

    async reorderColumns(boardId: number, columnOrders: { id: number; position: number }[]) {
        const updates = columnOrders.map(({ id, position }) =>
            prisma.column.update({
                where: { id },
                data: { position }
            })
        );

        return await prisma.$transaction(updates);
    }
}
