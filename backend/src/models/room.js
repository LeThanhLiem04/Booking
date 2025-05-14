import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Room Number hoặc tên phòng
  type: { type: String, required: true },
  price: { type: Number, required: true },
  capacity: { type: Number, required: true },
  status: { type: String, enum: ['available', 'occupied', 'maintenance'], default: 'available' },
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  image: { type: String }, // Ảnh đại diện
  images: [{ type: String }], // Nhiều ảnh
}, { timestamps: true });

export const Room = mongoose.model('Room', roomSchema);