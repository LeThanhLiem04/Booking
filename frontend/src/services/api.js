import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api', // Đảm bảo port khớp với backend
  withCredentials: true,
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const setToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Auth endpoints
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);
export const getUserProfile = () => api.get('/auth/me');

// User endpoints
export const getUsersForChat = () => api.get('/users/chat');
export const updateUserProfile = (data) => api.put('/auth/me', data);

// Admin endpoints
export const getAllUsers = () => api.get('/admin/users');
export const updateUser = (id, data) => api.put(`/admin/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);

// Hotel endpoints
export const getAllHotels = () => api.get('/admin/hotels');
export const getHotelById = (id) => api.get(`/admin/hotels/${id}`);
export const createHotel = (data) => api.post('/admin/hotels', data);
export const updateHotel = (id, data) => api.put(`/admin/hotels/${id}`, data);
export const deleteHotel = (id) => api.delete(`/admin/hotels/${id}`);

// Room endpoints
export const getRoomsByHotel = (hotelId) => api.get(`/hotels/${hotelId}/rooms`);
export const getRoomById = (id) => api.get(`/rooms/${id}`);
export const createRoom = (data) => api.post('/admin/rooms', data);
export const updateRoom = (id, data) => api.put(`/admin/rooms/${id}`, data);
export const deleteRoom = (id) => api.delete(`/admin/rooms/${id}`);

// Booking endpoints
export const createBooking = (data) => api.post('/bookings', data);
export const getMyBookings = () => api.get('/bookings/my-bookings');
export const getBookingById = (id) => api.get(`/bookings/${id}`);
export const updateBooking = (id, data) => api.put(`/bookings/${id}`, data);
export const deleteBooking = (id) => api.delete(`/bookings/${id}`);

// Review endpoints
export const createReview = (data) => api.post('/reviews', data);
export const getReviewsByHotel = (hotelId) => api.get(`/hotels/${hotelId}/reviews`);
export const updateReview = (id, data) => api.put(`/reviews/${id}`, data);
export const deleteReview = (id) => api.delete(`/reviews/${id}`);

// Chat endpoints
export const getConversation = (otherUserId) => api.get(`/messages/${otherUserId}`);
export const sendMessage = (data) => api.post('/messages', data);

// Existing endpoints
export const searchHotels = (params) => api.get('/hotels/search', { params });
export const createPayment = (data) => api.post('/payments', data);
export const confirmPayment = (data) => api.post('/payments/confirm', data);
export const getAllBookings = () => api.get('/admin/bookings');
export const getStats = () => api.get('/admin/stats');
export const confirmBooking = (id) => api.put(`/admin/bookings/${id}/confirm`);
export const getAllReviews = () => api.get('/reviews');
export const addRoom = (data) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => formData.append(key, data[key]));
  return api.post('/admin/rooms', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const getAllRooms = () => api.get('/admin/rooms');
export const getRooms = () => api.get('/rooms');
export const getBookings = () => api.get('/bookings');
export const cancelBooking = (bookingId) => api.delete(`/bookings/${bookingId}`);