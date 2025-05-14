import { messageService } from '../services/message-service.js';

export const messageController = {
  sendMessage: async (req, res) => {
    try {
      const { recipientId, content } = req.body;
      const senderId = req.user.id;
      const message = await messageService.sendMessage(senderId, recipientId, content);
      res.status(201).json(message);
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(400).json({ message: error.message });
    }
  },

  getConversation: async (req, res) => {
    try {
      const { otherUserId } = req.params;
      const userId = req.user.id;
      const messages = await messageService.getConversation(userId, otherUserId);
      res.status(200).json(messages);
    } catch (error) {
      console.error('Error fetching conversation:', error);
      res.status(500).json({ message: error.message });
    }
  },
};