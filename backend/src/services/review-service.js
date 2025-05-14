import { reviewRepository } from '../repositories/review-repository.js';
import { bookingRepository } from '../repositories/booking-repository.js';

export const reviewService = {
  createReview: async ({ hotelId, rating, comment }, userId) => {
    const hasBooked = await bookingRepository.findOne({ userId, hotelId, status: 'confirmed' });
    if (!hasBooked) throw new Error('You must book this hotel to review it');
    return await reviewRepository.create({ userId, hotelId, rating, comment });
  },

  respondToReview: async (reviewId, response, user) => {
    if (user.role !== 'admin') throw new Error('Unauthorized');
    return await reviewRepository.update(reviewId, { response, respondedBy: user.id });
  },

  getAllReviews: async (adminUser) => {
    if (adminUser.role !== 'admin') throw new Error('Unauthorized');
    return await reviewRepository.findAll();
  },

  deleteReview: async (reviewId, adminUser) => {
    if (adminUser.role !== 'admin') throw new Error('Unauthorized');
    return await reviewRepository.delete(reviewId);
  },
};