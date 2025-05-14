import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/user-repository.js';

export const userService = {
  register: async ({ email, password, name }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userRepository.create({ email, password: hashedPassword, name, role: 'user' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { user, token };
  },

  login: async ({ email, password }) => {
    const user = await userRepository.findByEmail(email);
    console.log('User found by email:', user); // Thêm log debug
    if (!user) {
      console.log('No user found for email:', email); // Thêm log
      throw new Error('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isMatch); // Thêm log debug
    if (!isMatch) {
      console.log('Password does not match for user:', user.email); // Thêm log
      throw new Error('Invalid credentials');
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { user, token };
  },

  getUserById: async (id) => {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    // Remove sensitive data
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  },

  getAllUsers: async (adminUser) => {
    if (adminUser.role !== 'admin') throw new Error('Unauthorized');
    return await userRepository.findAll();
  },

  updateUser: async (id, data, adminUser) => {
    if (adminUser.role !== 'admin') throw new Error('Unauthorized');
    if (data.password) data.password = await bcrypt.hash(data.password, 10);
    return await userRepository.update(id, data);
  },

  deleteUser: async (id, adminUser) => {
    if (adminUser.role !== 'admin') throw new Error('Unauthorized');
    return await userRepository.delete(id);
  },

  getUsersForChat: async (currentUser) => {
    const allUsers = await userRepository.findAll();
    console.log('Tất cả người dùng từ database:', allUsers);
    if (currentUser.role === 'user') {
      // User chỉ có thể chat với admin
      const adminUsers = allUsers.filter(u => u.role === 'admin');
      console.log('Danh sách admin cho user:', adminUsers);
      return adminUsers;
    } else if (currentUser.role === 'admin') {
      // Admin có thể chat với tất cả user
      const otherUsers = allUsers.filter(u => u.role === 'user');
      console.log('Danh sách user cho admin:', otherUsers);
      return otherUsers;
    }
    return [];
  },
};