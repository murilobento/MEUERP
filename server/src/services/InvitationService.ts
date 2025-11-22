import { PrismaClient, InvitationStatus } from '@prisma/client';

const prisma = new PrismaClient();

export class InvitationService {
    async create(boardId: number, inviteeId: number) {
        // Check if user is already a member
        const board = await prisma.board.findUnique({
            where: { id: boardId },
            include: { members: true }
        });

        if (!board) throw new Error('Board not found');

        const isMember = board.members.some(member => member.id === inviteeId);
        if (isMember) throw new Error('User is already a member of this board');

        // Check if invitation already exists
        const existingInvitation = await prisma.boardInvitation.findUnique({
            where: {
                boardId_inviteeId: {
                    boardId,
                    inviteeId
                }
            }
        });

        if (existingInvitation) {
            if (existingInvitation.status === 'PENDING') {
                throw new Error('User already has a pending invitation');
            }
            // If rejected or accepted (but removed), we can re-invite
            return await prisma.boardInvitation.update({
                where: { id: existingInvitation.id },
                data: { status: 'PENDING' }
            });
        }

        return await prisma.boardInvitation.create({
            data: {
                boardId,
                inviteeId,
                status: 'PENDING'
            }
        });
    }

    async listPending(userId: number) {
        return await prisma.boardInvitation.findMany({
            where: {
                inviteeId: userId,
                status: 'PENDING'
            },
            include: {
                board: {
                    include: {
                        owner: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });
    }

    async respond(invitationId: number, userId: number, status: InvitationStatus) {
        const invitation = await prisma.boardInvitation.findUnique({
            where: { id: invitationId }
        });

        if (!invitation) throw new Error('Invitation not found');
        if (invitation.inviteeId !== userId) throw new Error('Unauthorized');
        if (invitation.status !== 'PENDING') throw new Error('Invitation is not pending');

        const updatedInvitation = await prisma.boardInvitation.update({
            where: { id: invitationId },
            data: { status }
        });

        if (status === 'ACCEPTED') {
            await prisma.board.update({
                where: { id: invitation.boardId },
                data: {
                    members: {
                        connect: { id: userId }
                    }
                }
            });
        }

        return updatedInvitation;
    }
}
