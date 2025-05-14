import { paymentService } from '../services/payment-service.js';

export const createPayment = async (req, res) => {
  try {
    const { payment, clientSecret } = await paymentService.createPaymentIntent(req.body);
    res.status(201).json({ payment, clientSecret });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const confirmPayment = async (req, res) => {
  try {
    const payment = await paymentService.confirmPayment(req.body.paymentId, req.body.bookingId);
    res.status(200).json(payment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};