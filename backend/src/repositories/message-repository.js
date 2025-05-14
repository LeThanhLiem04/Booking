import { Message } from '../models/message.js';

export const messageRepository = {
  create: async (data) => {
    const message = new Message(data);
    return await message.save();
  },

  findByChatId: async (chatId) => {
    return await Message.find({ chatId })
      .populate('sender', 'email name role')
      .populate('readBy', 'email name role')
      .sort({ createdAt: 1 });
  },

  markAsRead: async (messageId, userId) => {
    return await Message.findByIdAndUpdate(
      messageId,
      { $addToSet: { readBy: userId } },
      { new: true }
    );
  },

  markAllAsRead: async (chatId, userId) => {
    return await Message.updateMany(
      { chatId, readBy: { $ne: userId } },
      { $addToSet: { readBy: userId } }
    );
  },

  findConversation: async (userId1, userId2) => await Message.find({
    $or: [
      { senderId: userId1, recipientId: userId2 },
      { senderId: userId2, recipientId: userId1 },
    ],
  }).sort('createdAt'),
};