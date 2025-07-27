const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.Controller");
const authMiddleware = require("../middlewares/authMiddleware");

// Routes
router.post("/check", authController.checkAuth)
router.post("/send-verify-mail", authController.sendVerifyMail);
router.get("/verify", authController.verifyAndCreateUser);
router.post("/send-repass-email", authController.sendResetPasswordEmail);
router.post("/reset-password", authController.rePass);
router.post("/login", authController.login);
router.get("/me", authMiddleware, authController.getMe);
router.patch("/me", authMiddleware, authController.updateUser);
router.get("/alluser", authMiddleware, authController.getAllUsers); // Cho riêng admin lấy tất cả user

module.exports = router;