// src/validators/authValidator.js

// Kiểm tra định dạng email hợp lệ
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // ví dụ: test@gmail.com
  return emailRegex.test(email);
};

// Validate dữ liệu đăng nhập
const validateLogin = ({ email, password }) => {
  if (!email || !password) {
    return "Please enter both email and password";
  }
  if (!isValidEmail(email)) {
    return "Invalid email format";
  }
  return null;
};

// Validate dữ liệu đăng ký
const validateRegister = ({ fullname, email, password, gender, dob }) => {
  if (!fullname || !email || !password || !gender || !dob) {
    return "Please fill in all required fields";
  }

  if (!isValidEmail(email)) {
    return "Invalid email format";
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }

  return null;
};

module.exports = {
  validateLogin,
  validateRegister,
};
