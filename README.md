# QuizMaster - Nền Tảng Thi Trắc Nghiệm Trực Tuyến Fullstack

QuizMaster là ứng dụng luyện thi và đánh giá năng lực trắc nghiệm trực tuyến toàn diện, được xây dựng theo kiến trúc Client-Server hiện đại. Ứng dụng cung cấp trải nghiệm làm bài thi tốc độ cao, giao diện trực quan và bộ công cụ quản trị mạnh mẽ.

---

## 🌟 Tính Năng Nổi Bật

### 1. Dành cho Thí sinh / Người dùng (User)
- **Trang chủ & Khám phá:** Danh mục chủ đề thi đa dạng, thống kê thời gian thực và bài thi nổi bật.
- **Xác thực & Bảo mật:**
  - Đăng ký tài khoản kèm liên kết xác thực qua Email (Token hết hạn sau 5 phút).
  - Đăng nhập bảo mật với JWT, lưu phiên đăng nhập.
  - Quên mật khẩu và đặt lại mật khẩu an toàn qua Email.
- **Trải nghiệm Làm bài thi (Quiz Runner Engine):**
  - Đồng hồ bấm giờ trực tiếp (Live Timer).
  - Thanh tiến độ làm bài thời gian thực.
  - Bảng điều hướng câu hỏi nhanh (Question Matrix Grid) hỗ trợ đánh dấu xem lại câu hỏi phân vân.
  - Cảnh báo nộp bài khi còn câu hỏi chưa chọn đáp án.
- **Tổng kết & Phân tích Kết quả:**
  - Chấm điểm tự động và tính tỷ lệ chính xác tức thì.
  - Hiệu ứng chúc mừng (Confetti) khi đạt kết quả cao.
  - Xem lại chi tiết từng câu hỏi: đối chiếu đáp án đã chọn và đáp án đúng với màu sắc trực quan.
- **Lịch sử & Cá nhân hóa:**
  - Lưu lại toàn bộ lịch sử các lần thi, điểm số và ngày giờ làm bài.
  - Xem và cập nhật thông tin cá nhân (Họ tên, giới tính, ngày sinh) và đổi mật khẩu.
  - Chuyển đổi linh hoạt giao diện Sáng / Tối (Light & Dark Theme).

### 2. Dành cho Quản trị viên (Admin Panel)
- **Bảng điều khiển (Dashboard):** Tổng quan số lượng chủ đề, câu hỏi và người dùng trong hệ thống.
- **Quản lý Chủ đề (Topics Management):** Thêm, sửa, xóa chủ đề thi (kèm kiểm tra ràng buộc câu hỏi).
- **Quản lý Câu hỏi (Questions Management):**
  - Lọc câu hỏi theo từng chủ đề.
  - Thêm / Sửa câu hỏi với 4 đáp án A, B, C, D và chọn đáp án chính xác.
  - Xóa câu hỏi với hộp thoại xác nhận an toàn.
- **Quản lý Người dùng (Users Management):**
  - Xem danh sách thành viên đăng ký.
  - Thay đổi vai trò người dùng (`USER` ⇄ `ADMIN`).
  - Cập nhật trạng thái hoạt động tài khoản (`ACTIVE`, `INACTIVE`, `BANNED`).

---

## 🛠 Công Nghệ Sử Dụng

### Frontend
- **Framework & Tooling:** React 18, Vite 6 (Single Page Application - SPA)
- **Routing:** React Router DOM v6
- **Icons:** Lucide React
- **Hiệu ứng:** Canvas Confetti
- **Styling:** Modern CSS Design System (CSS Custom Properties, Glassmorphism, Responsive Grid)

### Backend
- **Runtime:** Node.js, Express.js
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Authentication:** JSON Web Token (JWT), Bcrypt.js
- **Mailer:** Nodemailer (Gửi email kích hoạt & đổi mật khẩu qua SMTP)
- **CORS:** Cấu hình hỗ trợ đa cổng cho môi trường phát triển

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### Yêu cầu môi trường
- **Node.js:** Phiên bản `>= 18.x`
- **NPM:** Phiên bản `>= 9.x`
- **MongoDB:** MongoDB Atlas URI hoặc Local MongoDB

### 1. Cài đặt Backend (BE)
```bash
# Di chuyển vào thư mục BE
cd BE

# Cài đặt các gói phụ thuộc
npm install

# Kiểm tra file .env (cấu hình cổng và kết nối MongoDB)
# PORT=3002
# MONGO_URI=mongodb+srv://...
# JWT_SECRET=your_jwt_secret
# CLIENT_URL=http://localhost:5173
# EMAIL_USER=your_email@gmail.com
# EMAIL_PASS=your_app_password

# Khởi chạy server ở chế độ phát triển
npm run dev
```
Server Backend sẽ lắng nghe tại: `http://localhost:3002`

### 2. Cài đặt Frontend (FE)
```bash
# Mở một terminal mới và di chuyển vào thư mục FE
cd FE

# Cài đặt các gói phụ thuộc
npm install

# Khởi chạy Vite development server
npm run dev
```
Ứng dụng Frontend sẽ chạy tại: `http://localhost:5173`

---

## 📂 Cấu Trúc Thư Mục Dự Án

```
Quiz-fullstack/
├── BE/                           # Backend API (Node.js & Express)
│   ├── src/
│   │   ├── config/               # Cấu hình kết nối Database (db.js)
│   │   ├── controllers/          # Bộ điều khiển xử lý logic (Auth, Topic, Question, Submission)
│   │   ├── middlewares/          # Middleware xác thực JWT và kiểm tra quyền Admin
│   │   ├── models/               # Mongoose Schemas (User, Topic, Question, Submission, SubmissionAnswer)
│   │   ├── routes/               # Định nghĩa các API Endpoints
│   │   ├── utils/                # Tiện ích gửi email (sendMail.js)
│   │   └── validators/           # Validate dữ liệu đầu vào
│   ├── .env
│   ├── index.js                  # Điểm khởi chạy server chính
│   └── package.json
│
├── FE/                           # Frontend Client (Vite + React SPA)
│   ├── public/                   # Tài nguyên tĩnh
│   ├── src/
│   │   ├── api/                  # Fetch API client với JWT interceptor
│   │   ├── components/           # Các component tái sử dụng (Navbar, Footer, Modal, Toast, Guards)
│   │   ├── context/              # Quản lý trạng thái toàn cục (AuthContext, ThemeContext)
│   │   ├── layouts/              # Layout chính cho User và Admin
│   │   ├── pages/                # Các trang người dùng và trang quản trị
│   │   ├── services/             # Lớp giao tiếp API dịch vụ
│   │   ├── styles/               # CSS Design System & Theme variables
│   │   ├── App.jsx               # Bảng định tuyến React Router
│   │   └── main.jsx              # React root render
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 📡 Danh Sách API Chính (Endpoints)

| Phương thức | Endpoint | Mô tả | Quyền truy cập |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | Đăng nhập tài khoản | Public |
| `POST` | `/auth/send-verify-mail` | Đăng ký & gửi email xác thực | Public |
| `GET` | `/auth/verify?token=...` | Kích hoạt tài khoản từ token | Public |
| `POST` | `/auth/send-repass-email`| Yêu cầu đặt lại mật khẩu | Public |
| `POST` | `/auth/reset-password` | Đổi mật khẩu mới từ token | Public |
| `GET` | `/auth/me` | Lấy thông tin tài khoản hiện tại | User / Admin |
| `PATCH`| `/auth/me` | Cập nhật hồ sơ & mật khẩu | User / Admin |
| `GET` | `/auth/alluser` | Lấy danh sách toàn bộ người dùng | Admin |
| `PATCH`| `/auth/status/:id` | Thay đổi trạng thái tài khoản | Admin |
| `PATCH`| `/auth/role/:id` | Thay đổi vai trò người dùng | Admin |
| `GET` | `/topic` | Lấy danh sách tất cả chủ đề | Public |
| `GET` | `/topic/:id` | Lấy chi tiết một chủ đề | Public |
| `POST` | `/topic` | Tạo chủ đề mới | Admin |
| `PUT` | `/topic/:id` | Cập nhật chủ đề | Admin |
| `DELETE`| `/topic/:id` | Xóa chủ đề | Admin |
| `GET` | `/question/:topicId` | Lấy câu hỏi theo chủ đề để làm bài | Public |
| `GET` | `/question/all` | Lấy toàn bộ câu hỏi | Admin |
| `POST` | `/question` | Tạo câu hỏi mới | Admin |
| `PATCH`| `/question/:id` | Cập nhật câu hỏi | Admin |
| `DELETE`| `/question/:id` | Xóa câu hỏi | Admin |
| `POST` | `/submission` | Nộp bài thi và lưu kết quả | User |
| `GET` | `/submission` | Lấy lịch sử làm bài của người dùng | User |
| `GET` | `/submission/:id` | Xem chi tiết bảng điểm bài thi | User / Admin |

---

## 📄 Bản Quyền & Giấy Phép
Dự án được phân phối dưới giấy phép MIT.
