const express = require("express");
const router = express.Router();
const controller = require("../controllers/submission.Controller");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authMiddleware, controller.getAllSubmissions);
router.post("/", authMiddleware, controller.createSubmission);
router.put("/:id", authMiddleware, controller.updateSubmission);

module.exports = router;