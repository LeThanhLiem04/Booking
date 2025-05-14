import { Booking } from '../models/booking.js';

export const bookingRepository = {
  create: async (data) => await Booking.create(data),
  findByUserId: async (userId) => await Booking.find({ userId }).populate('roomId'),
  findOverlapping: async (roomId, checkInDate, checkOutDate) => await Booking.find({
    roomId,
    $or: [
      { checkInDate: { $lt: checkOutDate }, checkOutDate: { $gt: checkInDate } },
    ],
    status: { $ne: 'cancelled' },
  }),
  findAll: async () => await Booking.find()
    .populate('userId')
    .populate({
      path: 'roomId',
      populate: { path: 'hotelId' }
    }),
  update: async (id, data) => await Booking.findByIdAndUpdate(id, data, { new: true }),
  findById: async (id) => await Booking.findById(id),
  countDocuments: async (query) => await Booking.countDocuments(query), // Added for stats
  aggregate: async (pipeline) => await Booking.aggregate(pipeline), // Added for stats
};