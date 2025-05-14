import { chatService } from '../services/chat-service.js';

// Lấy danh sách chat của user
export const getUserChats = async (req, res) => {
  try {
    console.log('req.user in getUserChats:', req.user);
    const chats = await chatService.getUserChats(req.user.id);
    res.json(chats);
  } catch (error) {
    console.error('Error in getUserChats:', error);
    res.status(500).json({ message: error.message });
  }
};

// Lấy hoặc tạo chat mới
export const getOrCreateChat = async (req, res) => {
  try {
    console.log('req.user in getOrCreateChat:', req.user, 'userId:', req.params.userId);
    const { userId } = req.params;
    const chat = await chatService.getOrCreateChat(req.user.id, userId);
    res.json(chat);
  } catch (error) {
    console.error('Error in getOrCreateChat:', error);
    res.status(400).json({ message: error.message });
  }
};

// Gửi tin nhắn
export const sendMessage = async (req, res) => {
  try {
    console.log('req.user in sendMessage:', req.user, 'chatId:', req.params.chatId, 'content:', req.body.content);
    const { chatId } = req.params;
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    const messages = await chatService.sendMessage(chatId, req.user.id, content);
    res.json(messages);
  } catch (error) {
    console.error('Error in sendMessage:', error);
    res.status(400).json({ message: error.message });
  }
};

// Đánh dấu tin nhắn đã đọc
export const markMessagesAsRead = async (req, res) => {
  try {
    console.log('req.user in markMessagesAsRead:', req.user, 'chatId:', req.params.chatId);
    const { chatId } = req.params;
    const messages = await chatService.markMessagesAsRead(chatId, req.user.id);
    res.json(messages);
  } catch (error) {
    console.error('Error in markMessagesAsRead:', error);
    res.status(400).json({ message: error.message });
  }
};

// Lấy tin nhắn của một chat
export const getChatMessages = async (req, res) => {
  try {
    console.log('req.user in getChatMessages:', req.user, 'chatId:', req.params.chatId);
    const { chatId } = req.params;
    const messages = await chatService.getChatMessages(chatId);
    res.json(messages);
  } catch (error) {
    console.error('Error in getChatMessages:', error);
    res.status(400).json({ message: error.message });
  }
}; 