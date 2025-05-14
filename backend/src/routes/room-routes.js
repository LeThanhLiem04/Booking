import express from 'express';
import { roomController } from '../controllers/room-controller.js';
import { authenticate } from '../middlewares/auth-middleware.js';

const router = express.Router();

router.get('/', authenticate, roomController.getAllRooms);
router.post('/', authenticate, roomController.addRoom);
router.get('/hotels/:hotelId/rooms', roomController.getRoomsByHotel); // This is correct

export default router;