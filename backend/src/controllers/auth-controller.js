import { userService } from '../services/user-service.js';

/**
 * @description Register a new user
 * @route POST /api/auth/register
 */
export const register = async (req, res) => {
  try {
    const { user, token } = await userService.register(req.body);
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @description Login a user
 * @route POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    const { user, token } = await userService.login(req.body);
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

/**
 * @description Get current user profile
 * @route GET /api/auth/me
 */
export const getMe = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};