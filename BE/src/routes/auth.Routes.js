const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.Controller");
const authMiddleware = require("../middlewares/authMiddleware");
const checkAdmin = require("../middlewares/checkAdmin")

// Routes
router.post("/check", authController.checkAuth)
router.post("/send-verify-mail", authController.sendVerifyMail);
router.get("/verify", authController.verifyAndCreateUser);
router.post("/send-repass-email", authController.sendResetPasswordEmail);
router.post("/reset-password", authController.rePass);
router.post("/login", authController.login);
router.get("/me", authMiddleware, authController.getMe);
router.patch("/me", authMiddleware, authController.updateUser);
router.get("/alluser", authMiddleware, checkAdmin, authController.getAllUsers); // Cho riêng admin lấy tất cả user
router.patch("/status/:id", authMiddleware, checkAdmin, authController.status); // Cho riêng admin hủy tài khoản người dùng
router.patch("/role/:id", authMiddleware, checkAdmin, authController.role); // Cho riêng admin thay đổi role tài khoản người dùng


module.exports = router;