const mongoose = require("mongoose") // Khai báo thư viện

// Định nghĩa schema
const UserSchema = new mongoose.Schema({
  fullname: { type: String, trim: true, required: true },
  gender: { type: String, trim: true, required: true },
  dob: { type: Date, trim: true, required: true },
  email: { type: String, trim: true, required: true, unique: true },
  password: { type: String, trim: true, required: true },
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
  status: { type: String, trim: true, default: "ACTIVE" }
}, { timestamps: true }
);

// Tạo model
const User = mongoose.model('User', UserSchema);

module.exports = User;