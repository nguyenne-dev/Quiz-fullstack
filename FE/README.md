# EduExam Platform - Frontend Client (Vite + React)

Frontend của EduExam Platform được xây dựng bằng **Vite** và **React 18**, mang lại tốc độ phản hồi tức thì, trải nghiệm Single Page Application (SPA) mượt mà và giao diện chuẩn UI/UX hiện đại.

---

## 🛠 Công Nghệ & Thư Viện

- **Vite 6**: Tối ưu hóa build và Hot Module Replacement (HMR) cực nhanh.
- **React 18**: UI component-based architecture.
- **React Router DOM v6**: Định tuyến SPA với các Route Guard (`ProtectedRoute`, `AdminRoute`).
- **Lucide React**: Bộ icon vector sắc nét, đồng bộ.
- **Canvas Confetti**: Hiệu ứng chúc mừng khi hoàn thành bài thi với kết quả cao.
- **Custom CSS System**: Hỗ trợ toàn diện 2 giao diện Sáng / Tối (Light / Dark Mode), hiệu ứng Glassmorphism và tối ưu hóa responsive.

---

## 🚀 Khởi Chạy Ứng Dụng

```bash
# Cài đặt thư viện phụ thuộc
npm install

# Chạy server phát triển (cổng mặc định 5173)
npm run dev

# Tạo bản build production tối ưu
npm run build

# Xem thử bản build production
npm run preview
```

---

## 📁 Cấu Trúc Mã Nguồn

- `src/api/`: Module kết nối API Backend với JWT Authentication.
- `src/components/`:
  - `common/`: Navbar, Footer, Modal, Toast, LoadingSpinner.
  - `auth/`: ProtectedRoute, AdminRoute.
- `src/context/`: AuthContext, ThemeContext.
- `src/layouts/`: UserLayout, AdminLayout.
- `src/pages/`:
  - `user/`: Trang chủ, Danh mục chủ đề, Làm bài thi, Kết quả, Lịch sử, Đăng nhập, Đăng ký, Kích hoạt tài khoản, Quên mật khẩu, Hồ sơ cá nhân, Giới thiệu, Liên hệ.
  - `admin/`: Bảng điều khiển (Dashboard), Quản lý chủ đề, Quản lý câu hỏi, Quản lý người dùng.
- `src/services/`: Các module dịch vụ gọi API (Auth, Topic, Question, Submission).
- `src/styles/`: CSS Design System và bộ biến giao diện.
