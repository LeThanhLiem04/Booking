import express from 'express';
import { messageController } from '../controllers/message-controller.js';
import { authenticate } from '../middlewares/auth-middleware.js';

const router = express.Router();

router.post('/', authenticate, messageController.sendMessage);
router.get('/:otherUserId', authenticate, messageController.getConversation);

export default router;