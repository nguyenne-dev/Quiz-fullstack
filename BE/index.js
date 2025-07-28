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
dotenv.config();

// ==========================
// 3. Khởi tạo ứng dụng Express
// ==========================
const app = express();

// ==========================
// 4. Middleware CORS nghiêm ngặt theo .env
// ==========================
// Chỉ cho phép các domain được khai báo trong biến CLIENT_URL của .env
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((url) => url.trim().replace(/\/$/, ''))
  : [];

const corsOptions = {
  origin: function (origin, callback) {
    // 1. Cho phép các request không có origin header (Postman, Server-to-Server, curl)
    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = origin.trim().replace(/\/$/, '');

    // 2. Kiểm tra xem origin có nằm trong danh sách CLIENT_URL của file .env không
    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    // 3. Cấm tuyệt đối mọi domain không được khai báo trong .env
    const corsError = new Error(`CORS Error: Domain [${origin}] không có trong danh sách CLIENT_URL của .env và bị từ chối truy cập.`);
    corsError.status = 403;
    return callback(corsError);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With', 'Origin'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Middleware cho phép BE đọc được JSON từ req.body
app.use(express.json());

// ==========================
// 5. Kết nối MongoDB
// ==========================
connectDB();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Quiz API is healthy and running', timestamp: new Date().toISOString() });
});

// ==========================
// 6. Routes (API endpoint)
// ==========================
const authRoutes = require('./src/routes/auth.Routes');
const topicRoutes = require('./src/routes/topic.Routes');
const questionRoutes = require('./src/routes/question.Routes');
const submissionRoutes = require('./src/routes/submission.Routes');
const submissionAnswerRoutes = require('./src/routes/submissionAnswer.Routes');

app.use('/auth', authRoutes);
app.use('/topic', topicRoutes);
app.use('/question', questionRoutes);
app.use('/submission', submissionRoutes);
app.use('/submission-answer', submissionAnswerRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Lỗi máy chủ nội bộ',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// ==========================
// 7. Khởi động server
// ==========================
const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`\x1b[32m●\x1b[0m Server is running on port ${PORT}`);
  console.log(`🔒 CORS Whitelist từ .env: [${allowedOrigins.join(', ')}]`);
});