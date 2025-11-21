import { PrismaClient, CardPriority } from '@prisma/client';

const prisma = new PrismaClient();

export class CardService {
    async list(columnId?: number) {
        return await prisma.card.findMany({
            where: columnId ? { columnId } : undefined,
            include: {
                assignedTo: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true
                    }
                },
                column: {
                    select: {
                        id: true,
                        title: true,
                        boardId: true
                    }
                }
            },
            orderBy: { position: 'asc' }
        });
    }

    async getById(id: number) {
        return await prisma.card.findUnique({
            where: { id },
            include: {
                assignedTo: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true
                    }
                },
                column: {
                    select: {
                        id: true,
                        title: true,
                        boardId: true
                    }
                }
            }
        });
    }

    async create(data: {
        title: string;
        description?: string;
        columnId: number;
        priority?: CardPriority;
        dueDate?: Date;
        assignedToId?: number;
    }) {
        const maxPosition = await prisma.card.findFirst({
            where: { columnId: data.columnId },
            orderBy: { position: 'desc' },
            select: { position: true }
        });

        return await prisma.card.create({
            data: {
                ...data,
                position: (maxPosition?.position ?? -1) + 1
            },
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
        });
    }

    async update(
        id: number,
        data: {
            title?: string;
            description?: string;
            priority?: CardPriority;
            dueDate?: Date;
            assignedToId?: number;
        }
    ) {
        return await prisma.card.update({
            where: { id },
            data,
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
        });
    }

    async delete(id: number) {
        return await prisma.card.delete({
            where: { id }
        });
    }

    async moveCard(
        cardId: number,
        targetColumnId: number,
        targetPosition: number
    ) {
        const card = await prisma.card.findUnique({
            where: { id: cardId }
        });

        if (!card) {
            throw new Error('Card not found');
        }

        // Se mudou de coluna
        if (card.columnId !== targetColumnId) {
            // Atualiza posições na coluna de origem
            await prisma.card.updateMany({
                where: {
                    columnId: card.columnId,
                    position: { gt: card.position }
                },
                data: {
                    position: { decrement: 1 }
                }
            });

            // Atualiza posições na coluna de destino
            await prisma.card.updateMany({
                where: {
                    columnId: targetColumnId,
                    position: { gte: targetPosition }
                },
                data: {
                    position: { increment: 1 }
                }
            });

            // Move o card
            return await prisma.card.update({
                where: { id: cardId },
                data: {
                    columnId: targetColumnId,
                    position: targetPosition
                },
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
            });
        } else {
            // Mesma coluna, apenas reordena
            const oldPosition = card.position;

            if (oldPosition < targetPosition) {
                // Movendo para baixo
                await prisma.card.updateMany({
                    where: {
                        columnId: targetColumnId,
                        position: {
                            gt: oldPosition,
                            lte: targetPosition
                        }
                    },
                    data: {
                        position: { decrement: 1 }
                    }
                });
            } else if (oldPosition > targetPosition) {
                // Movendo para cima
                await prisma.card.updateMany({
                    where: {
                        columnId: targetColumnId,
                        position: {
                            gte: targetPosition,
                            lt: oldPosition
                        }
                    },
                    data: {
                        position: { increment: 1 }
                    }
                });
            }

            return await prisma.card.update({
                where: { id: cardId },
                data: { position: targetPosition },
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
            });
        }
    }
}
