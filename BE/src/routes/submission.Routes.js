const express = require("express");
const router = express.Router();
const controller = require("../controllers/submission.Controller");
const authMiddleware = require("../middlewares/authMiddleware");
const checkAdmin = require("../middlewares/checkAdmin");

// ==============================
// Admin Submissions Routes (Bảo vệ bởi authMiddleware + checkAdmin)
// ==============================
router.get("/admin/stats", authMiddleware, checkAdmin, controller.getAdminSubmissionStats);
router.get("/admin/all", authMiddleware, checkAdmin, controller.getAllSubmissionsAdmin);
router.get("/admin/:id", authMiddleware, checkAdmin, controller.getAdminSubmissionDetail);
router.delete("/admin/:id", authMiddleware, checkAdmin, controller.deleteSubmissionAdmin);

// ==============================
// User Submissions Routes
// ==============================
router.get("/", authMiddleware, controller.getAllSubmissions);
router.get("/:id", authMiddleware, controller.getSubmissions);
router.post("/", authMiddleware, controller.createSubmission);
router.put("/:id", authMiddleware, controller.updateSubmission);

module.exports = router;