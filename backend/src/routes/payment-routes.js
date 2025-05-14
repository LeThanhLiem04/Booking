import express from 'express';
import { createPayment, confirmPayment } from '../controllers/payment-controller.js';
import { authenticate } from '../middlewares/auth-middleware.js';

const router = express.Router();

router.post('/', authenticate, createPayment);
router.post('/confirm', authenticate, confirmPayment);

export default router;