import express from 'express';
import { 
  getAllUsers, 
  updateUser, 
  deleteUser, 
  getAllBookings, 
  confirmBooking 
} from '../controllers/admin-controller.js';
import { getStats } from '../controllers/statistics-controller.js';
import { roomController } from '../controllers/room-controller.js';
import { hotelController } from '../controllers/hotel-controller.js'; // Import hotelController
import { authenticate } from '../middlewares/auth-middleware.js';

const router = express.Router();

// Existing routes
router.get('/users', authenticate, getAllUsers);
router.put('/users/:id', authenticate, updateUser);
router.delete('/users/:id', authenticate, deleteUser);
router.get('/bookings', authenticate, getAllBookings);
router.put('/bookings/:id/confirm', authenticate, confirmBooking);
router.get('/stats', authenticate, getStats);

// Room management routes
router.get('/rooms', authenticate, roomController.getAllRooms);
router.post('/rooms', authenticate, roomController.addRoom);
router.put('/rooms/:id', authenticate, roomController.updateRoom);
router.delete('/rooms/:id', authenticate, roomController.deleteRoom);

// Hotel management routes
router.get('/hotels', authenticate, hotelController.getAllHotels);
router.post('/hotels', authenticate, hotelController.addHotel);
router.put('/hotels/:id', authenticate, hotelController.updateHotel);
router.delete('/hotels/:id', authenticate, hotelController.deleteHotel);

export default router;