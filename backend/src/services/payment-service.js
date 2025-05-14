import Stripe from 'stripe';
import { paymentRepository } from '../repositories/payment-repository.js';
import { bookingRepository } from '../repositories/booking-repository.js';
import { sendEmail } from '../config/nodemailer.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const paymentService = {
  createPaymentIntent: async ({ bookingId, amount }) => {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'usd',
      metadata: { bookingId },
    });

    const payment = await paymentRepository.create({
      bookingId,
      amount,
      paymentMethod: 'stripe',
      transactionId: paymentIntent.id,
    });

    return { payment, clientSecret: paymentIntent.client_secret };
  },

  confirmPayment: async (paymentId, bookingId) => {
    const payment = await paymentRepository.update(paymentId, { status: 'completed' });
    await bookingRepository.update(bookingId, { status: 'confirmed' });
    const booking = await bookingRepository.findById(bookingId).populate('userId');
    await sendEmail(
      booking.userId.email,
      'Booking Confirmed',
      `Your booking (ID: ${bookingId}) has been confirmed!`
    );
    return payment;
  },
};