import express from 'express';
import { 
  createReview, 
  respondToReview, 
  getAllReviews, 
  deleteReview 
} from '../controllers/review-controller.js';
import { authenticate } from '../middlewares/auth-middleware.js';

const router = express.Router();

router.post('/', authenticate, createReview);
router.put('/:id/respond', authenticate, respondToReview);
router.get('/', authenticate, getAllReviews); // Added for admin
router.delete('/:id', authenticate, deleteReview); // Added for admin

export default router;