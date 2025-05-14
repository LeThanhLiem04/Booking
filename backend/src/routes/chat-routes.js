import express from 'express';
import { authenticate } from '../middlewares/auth-middleware.js';
import {
  getUserChats,
  getOrCreateChat,
  sendMessage,
  markMessagesAsRead,
  getChatMessages
} from '../controllers/chat-controller.js';

const router = express.Router();

// Tất cả routes đều yêu cầu xác thực
router.use(authenticate);

// Lấy danh sách chat của user
router.get('/', getUserChats);

// Lấy hoặc tạo chat mới với một user
router.get('/user/:userId', getOrCreateChat);

// Gửi tin nhắn trong một chat
router.post('/:chatId/messages', sendMessage);

// Đánh dấu tin nhắn đã đọc
router.put('/:chatId/read', markMessagesAsRead);

// Lấy tin nhắn của một chat
router.get('/:chatId/messages', getChatMessages);

export default router; 