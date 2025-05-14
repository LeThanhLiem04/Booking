import { chatRepository } from '../repositories/chat-repository.js';
import { messageRepository } from '../repositories/message-repository.js';
import { userRepository } from '../repositories/user-repository.js';

export const chatService = {
  // Lấy danh sách chat của user
  getUserChats: async (userId) => {
    return await chatRepository.findByParticipant(userId);
  },

  // Lấy hoặc tạo chat mới giữa 2 user
  getOrCreateChat: async (user1Id, user2Id) => {
    // Kiểm tra xem user2 có tồn tại không
    const user2 = await userRepository.findById(user2Id);
    if (!user2) {
      throw new Error('User not found');
    }

    // Kiểm tra role của user2
    if (user2.role !== 'admin' && user2.role !== 'user') {
      throw new Error('Invalid user role');
    }

    return await chatRepository.findOrCreateChat(user1Id, user2Id);
  },

  // Gửi tin nhắn
  sendMessage: async (chatId, senderId, content) => {
    // Tạo tin nhắn mới
    const message = await messageRepository.create({
      chatId,
      sender: senderId,
      content
    });

    // Cập nhật lastMessage của chat
    await chatRepository.updateLastMessage(chatId, message);

    // Tăng unreadCount cho người nhận
    const chat = await chatRepository.findById(chatId);
    const recipientId = chat.participants.find(id => id.toString() !== senderId);
    await chatRepository.incrementUnreadCount(chatId, recipientId);

    return await messageRepository.findByChatId(chatId);
  },

  // Đánh dấu tin nhắn đã đọc
  markMessagesAsRead: async (chatId, userId) => {
    await messageRepository.markAllAsRead(chatId, userId);
    await chatRepository.resetUnreadCount(chatId, userId);
    return await messageRepository.findByChatId(chatId);
  },

  // Lấy tin nhắn của một chat
  getChatMessages: async (chatId) => {
    return await messageRepository.findByChatId(chatId);
  }
}; 