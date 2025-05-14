import { bookingRepository } from '../repositories/booking-repository.js';

export const statisticsService = {
  getStats: async (adminUser) => {
    if (adminUser.role !== 'admin') throw new Error('Unauthorized');

    const totalBookings = await bookingRepository.countDocuments({ status: 'confirmed' });
    const totalRevenue = await bookingRepository.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);

    return {
      totalBookings,
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
    };
  },
};