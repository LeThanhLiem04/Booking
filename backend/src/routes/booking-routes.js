import express from 'express';
import { createBooking, getBookings, getBooking, confirmBooking } from '../controllers/booking-controller.js';
import { authenticate, adminMiddleware } from '../middlewares/auth-middleware.js';

const router = express.Router();

router.post('/', authenticate, createBooking);
router.get('/', authenticate, getBookings);
router.get('/:id', authenticate, getBooking);
router.put('/:id/confirm', authenticate, adminMiddleware, confirmBooking); // Add this route

export default router;