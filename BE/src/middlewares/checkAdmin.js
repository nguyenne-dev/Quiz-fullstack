const User = require("../models/User");

const checkAdmin = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user || user.role !== "ADMIN") {
    return res.status(403).json({ success: false, message: "Bạn không có quyền truy cập" });
  }
  next();
};

module.exports = checkAdmin;