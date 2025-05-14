import { Chat } from '../models/chat.js';

export const chatRepository = {
  create: async (data) => {
    const chat = new Chat(data);
    return await chat.save();
  },

  findById: async (id) => {
    return await Chat.findById(id)
      .populate('participants', 'email name role')
      .populate('lastMessage.sender', 'email name role');
  },

  findByParticipant: async (userId) => {
    return await Chat.find({ participants: userId })
      .populate('participants', 'email name role')
      .populate('lastMessage.sender', 'email name role')
      .sort({ updatedAt: -1 });
  },

  findOrCreateChat: async (user1Id, user2Id) => {
    let chat = await Chat.findOne({
      participants: { $all: [user1Id, user2Id] }
    });

    if (!chat) {
      chat = await Chat.create({
        participants: [user1Id, user2Id],
        unreadCount: new Map([[user1Id, 0], [user2Id, 0]])
      });
    }

    return await Chat.findById(chat._id)
      .populate('participants', 'email name role')
      .populate('lastMessage.sender', 'email name role');
  },

  updateLastMessage: async (chatId, message) => {
    return await Chat.findByIdAndUpdate(
      chatId,
      {
        lastMessage: {
          content: message.content,
          sender: message.sender,
          timestamp: message.createdAt
        }
      },
      { new: true }
    );
  },

  incrementUnreadCount: async (chatId, userId) => {
    const chat = await Chat.findById(chatId);
    const currentCount = chat.unreadCount.get(userId) || 0;
    chat.unreadCount.set(userId, currentCount + 1);
    return await chat.save();
  },

  resetUnreadCount: async (chatId, userId) => {
    const chat = await Chat.findById(chatId);
    chat.unreadCount.set(userId, 0);
    return await chat.save();
  }
}; 