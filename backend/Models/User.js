// models/User.js
import mongoose, { model } from 'mongoose';
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'users',
  },
  file: {  // Change this from `file` to `avatar` for better clarity
    type: String,
    required: false,  // Avatar is optional initially
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default model('User', UserSchema);
