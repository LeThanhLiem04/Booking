import { bookingService } from '../services/booking-service.js';

/**
 * @description Create a booking
 * @route POST /api/bookings
 */
export const createBooking = async (req, res) => {
  try {
    const booking = await bookingService.createBooking(req.body, req.user.id);
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @description Get user bookings
 * @route GET /api/bookings
 */
export const getBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getUserBookings(req.user.id);
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description Get a single booking by ID
 * @route GET /api/bookings/:id
 */
export const getBooking = async (req, res) => {
  try {
    console.log(`Fetching booking with ID: ${req.params.id} for user: ${req.user.id}`);
    const booking = await bookingService.getBookingById(req.params.id, req.user.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    console.log('Booking fetched:', booking);
    res.status(200).json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description Confirm a booking (Admin only)
 * @route PUT /api/admin/bookings/:id/confirm
 */
export const confirmBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await bookingService.confirmBooking(id);
    res.status(200).json(booking);
  } catch (error) {
    console.error('Error confirming booking:', error);
    res.status(400).json({ message: error.message });
  }
};