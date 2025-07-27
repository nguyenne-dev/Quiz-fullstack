const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const sendMail = require("../utils/sendMail");
const { validateLogin } = require("../validators/authValidator");
const { validateRegister } = require("../validators/authValidator");

// Gửi mail xác nhận khi đăng ký
const sendVerifyMail = async (req, res) => {
  try {
    const { fullname, email, password, gender, dob } = req.body;

    //  Validate input
    const error = validateRegister(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    // Kiểm tra nếu email đã tồn tại
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email is already in use." });
    }

    // Mã hoá mật khẩu và tạo token xác thực
    const hashedPassword = await bcrypt.hash(password, 10);
    const payload = { fullname, email, password: hashedPassword, gender, dob };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "5m" });

    const verifyLink = `${process.env.CLIENT_URL}/verify?token=${token}`;

    await sendMail(
      email,
      "Verify Your Email - Quiz App",
      `
        <h3>Hello ${fullname},</h3>
        <p>Please click the link below to verify your account:</p>
        <a href="${verifyLink}">${verifyLink}</a>
        <p>This link will expire in 5 minutes.</p>
      `
    );

    res.json({ success: true, message: "Verification email sent. Please check your inbox." });
  } catch (err) {
    console.error("Error sending verification email:", err);
    res.status(500).json({ success: false, message: "Failed to send verification email." });
  }
};

// Xác thực token từ email và tạo tài khoản
const verifyAndCreateUser = async (req, res) => {
  try {
    const { token } = req.query;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { fullname, email, password, gender, dob } = decoded;

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ success: false, message: "Your account has already been verified." });
    }

    const newUser = new User({
      fullname,
      email,
      password,
      gender,
      dob,
    });

    await newUser.save();
    return res.status(200).json({
      success: true,
      message: "Your email has been successfully verified. You can now log in.",
      user: {
        fullname: newUser.fullname,
        email: newUser.email,
        gender: newUser.gender,
        dob: newUser.dob,
        _id: newUser._id,
      }
    });
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(400).json({ success: false, message: "Invalid or expired verification link." });
  }
};

// Đăng nhập
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Gọi hàm validate
    const errorMessage = validateLogin({ email, password });
    if (errorMessage) {
      return res.status(400).json({ success: false, message: errorMessage });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Mật khẩu không đúng" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        gender: user.gender,
        dob: user.dob,
        role: user.role,
      }
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Lấy thông tin người dùng hiện tại
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // bỏ mật khẩu
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Get me error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Lấy tất cả người dùng (bỏ mật khẩu)
const getAllUsers = async (req, res) => {
  try {
    // Lấy user hiện tại từ token (req.user do middleware checkAuth gán vào)
    const currentUser = await User.findById(req.user.id);

    // Kiểm tra quyền
    if (!currentUser || currentUser.role !== "ADMIN") {
      return res.status(403).json({ success: false, message: "Bạn không có quyền truy cập" });
    }

    const users = await User.find().select("-password"); // bỏ trường password khi trả về
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Get all users error:", error.message);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};


const updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullname, gender, dob, password } = req.body;

    const updateData = {
      fullname,
      gender,
      dob,
    };

    // Nếu có password mới thì mã hóa và cập nhật
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
    }

    res.json({ success: true, message: "Cập nhật thành công", data: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const checkAuth = async (req, res) => {
  try {
    const { token, _id } = req.body;

    // Kiểm tra token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Kiểm tra token có khớp với id gửi về không
    if (decoded.id !== _id) {
      return res.status(403).json({ success: false, message: "ID không khớp với token." });
    }

    // Tìm người dùng trong database
    const fUser = await User.findById(_id);

    if (!fUser) {
      return res.status(404).json({ success: false, message: "Người dùng không tồn tại." });
    }

    // Nếu hợp lệ
    return res.status(200).json({ success: true, message: "Xác thực thành công!", role: fUser.role });

  } catch (error) {
    console.error(error);
    return res.status(401).json({ success: false, message: "Token không hợp lệ hoặc đã hết hạn." });
  }
};

// Gửi email đặt lại mật khẩu
const sendResetPasswordEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const existing = await User.findOne({ email });
    if (!existing) {
      return res.status(400).json({ success: false, message: "Tài khoản không tồn tại" });
    }

    const payload = { userId: existing._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });

    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    await sendMail(
      email,
      "Reset your password - Quiz App",
      `
        <h3>Xin chào</h3>
        <p>Nhấn vào link bên dưới đặt lại mật khẩu của bạn</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Link có hiệu lực trong 15 phút.</p>
      `
    )
    res.status(200).json({ success: true, message: "Đã gửi email xác nhận, vui lòng kiểm tra email." })

  } catch (error) {
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
}

const rePass = async (req, res) => {
  try {
    const { token } = req.query;
    const { password } = req.body;
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu phải có ít nhất 6 ký tự",
      });
    }
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, message: "Token không hợp lệ hoặc đã hết hạn" });
    }
    const { userId } = decoded;
    const userExist = await User.findById(userId);
    if (!userExist) {
      return res.status(400).json({ success: false, message: "Không tìm thấy người dùng" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(userId, { password: hashedPassword });
    return res.status(200).json({ success: true, message: "Đã cập nhật mật khẩu" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
}

module.exports = {
  sendVerifyMail,
  verifyAndCreateUser,
  login,
  getMe,
  getAllUsers,
  checkAuth,
  updateUser,
  sendResetPasswordEmail,
  rePass,
};
