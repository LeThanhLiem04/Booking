import { reviewService } from '../services/review-service.js';

/**
 * @description Create a review
 * @route POST /api/reviews
 */
export const createReview = async (req, res) => {
  try {
    const review = await reviewService.createReview(req.body, req.user.id);
    res.status(201).json(review);
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

/**
 * @description Respond to a review
 * @route PUT /api/reviews/:id/respond
 */
export const respondToReview = async (req, res) => {
  try {
    const review = await reviewService.respondToReview(req.params.id, req.body.response, req.user);
    res.status(200).json(review);
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

/**
 * @description Get all reviews (admin only)
 * @route GET /api/reviews
 */
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await reviewService.getAllReviews(req.user);
    res.status(200).json(reviews);
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

/**
 * @description Delete a review (admin only)
 * @route DELETE /api/reviews/:id
 */
export const deleteReview = async (req, res) => {
  try {
    await reviewService.deleteReview(req.params.id, req.user);
    res.status(204).send();
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};