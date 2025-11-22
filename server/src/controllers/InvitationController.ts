import { Request, Response } from 'express';
import { InvitationService } from '../services/InvitationService';

const invitationService = new InvitationService();

export class InvitationController {
    async listPending(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const invitations = await invitationService.listPending(userId);
            res.json(invitations);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch invitations' });
        }
    }

    async respond(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { id } = req.params;
            const { status } = req.body;

            if (!['ACCEPTED', 'REJECTED'].includes(status)) {
                return res.status(400).json({ error: 'Invalid status' });
            }

            const invitation = await invitationService.respond(parseInt(id), userId, status);
            res.json(invitation);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
