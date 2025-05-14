import { userService } from '../services/user-service.js';

export const userController = {
  /**
   * @description Get users for chat based on current user's role
   * @route GET /api/users/chat
   */
  getUsersForChat: async (req, res) => {
    try {
      console.log('req.user in getUsersForChat:', req.user);
      const currentUser = req.user;
      const users = await userService.getUsersForChat(currentUser);
      console.log('users for chat:', users);
      res.status(200).json(users);
    } catch (error) {
      console.error('Error in getUsersForChat:', error);
      res.status(500).json({ message: error.message });
    }
  },
};