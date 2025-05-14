import { hotelRepository } from '../repositories/hotel-repository.js';

export const hotelService = {
  createHotel: async (data, user) => {
    if (user.role !== 'admin') throw new Error('Unauthorized');
    return await hotelRepository.create(data);
  },
  searchHotels: async ({ name, location, minPrice, maxPrice, amenities }) => {
    const query = {};
    if (name) query.name = { $regex: name, $options: 'i' };
    if (location) query.location = { $regex: location, $options: 'i' };
    if (minPrice || maxPrice) query.price = {};
    if (minPrice) query.price.$gte = minPrice;
    if (maxPrice) query.price.$lte = maxPrice;
    if (amenities) query.amenities = { $all: amenities.split(',') };
    return await hotelRepository.findAll(query);
  },
};