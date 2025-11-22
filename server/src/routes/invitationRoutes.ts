import { Router } from 'express';
import { InvitationController } from '../controllers/InvitationController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const invitationController = new InvitationController();

router.use(authMiddleware);

router.get('/', invitationController.listPending);
router.put('/:id/respond', invitationController.respond);

export default router;
