import { messageRepository } from '../repositories/message-repository.js';

export const messageService = {
  sendMessage: async (senderId, recipientId, content) => {
    return await messageRepository.create({ senderId, recipientId, content });
  },

  getConversation: async (userId1, userId2) => {
    return await messageRepository.findConversation(userId1, userId2);
  },
};