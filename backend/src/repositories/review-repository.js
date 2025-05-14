import { Review } from '../models/review.js';

export const reviewRepository = {
  create: async (data) => await Review.create(data),
  findByHotelId: async (hotelId) => await Review.find({ hotelId }).populate('userId'),
  findAll: async () => await Review.find().populate('userId hotelId'), // Added for admin
  update: async (id, data) => await Review.findByIdAndUpdate(id, data, { new: true }),
  delete: async (id) => await Review.findByIdAndDelete(id),
};