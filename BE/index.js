// ==========================
// 1. Import thư viện cần thiết
// ==========================
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

// ==========================
// 2. Cấu hình biến môi trường
// ==========================
dotenv.config(); // Đọc biến từ file .env

// ==========================
// 3. Khởi tạo ứng dụng Express
// ==========================
const app = express();

// ==========================
// 4. Middleware toàn cục
// ==========================

// Cho phép CORS (giao tiếp giữa FE và BE)
app.use(cors({
  origin: process.env.CLIENT_URL, // URL FE cho phép gọi API
  credentials: true, // Cho phép gửi cookie nếu có (dùng auth cookie)
}));

// Middleware cho phép BE đọc được JSON từ req.body
app.use(express.json());

// ==========================
// 5. Kết nối MongoDB
// ==========================
connectDB(); // Gọi hàm kết nối DB (trong src/config/db.js)

// ==========================
// 6. Routes (API endpoint)
// ==========================

const authRoutes = require('./src/routes/auth.Routes');
const topicRoutes = require('./src/routes/topic.Routes');
// const questionRoutes = require('./src/routes/question.Routes');


app.use('/auth', authRoutes);
app.use('/topic', topicRoutes);
// app.use('/question', questionRoutes);

// TODO: Gắn router sau khi viết xong (VD: auth, quiz, user...)
// const authRoutes = require('./src/routes/authRoutes');
// app.use('/api/auth', authRoutes);

// ==========================
// 7. Khởi động server
// ==========================
const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`\x1b[32m●\x1b[0m Server is running on port ${PORT}`)
})