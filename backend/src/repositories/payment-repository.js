import { Payment } from '../models/payment.js';

export const paymentRepository = {
  create: async (data) => await Payment.create(data),
  update: async (id, data) => await Payment.findByIdAndUpdate(id, data, { new: true }),
};