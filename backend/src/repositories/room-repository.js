import { Room } from '../models/room.js';

export const roomRepository = {
  findAll: async () => {
    return await Room.find().populate('hotelId');
  },

  findById: async (id) => {
    return await Room.findById(id);
  },

  create: async (data) => {
    const room = new Room(data);
    return await room.save();
  },

  update: async (id, data) => {
    return await Room.findByIdAndUpdate(id, data, { new: true });
  },

  delete: async (id) => {
    return await Room.findByIdAndDelete(id);
  },
};