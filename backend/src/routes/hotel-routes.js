import express from 'express';
import { hotelController } from '../controllers/hotel-controller.js';
import { roomController } from '../controllers/room-controller.js'; // Add this import

const router = express.Router();

router.get('/', hotelController.getAllHotels);
router.get('/search', hotelController.searchHotels); // New search route
router.get('/hotels/:hotelId/rooms', roomController.getRoomsByHotel); // Add this route

export default router;