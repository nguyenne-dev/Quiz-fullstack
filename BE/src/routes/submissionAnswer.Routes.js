const express = require("express");
const router = express.Router();
const controller = require("../controllers/submissionAnswer.Controller");
const authMiddleware = require("../middlewares/authMiddleware")

router.get("/", authMiddleware, controller.getAllSubmissionAnswers);
router.post("/", authMiddleware, controller.createSubmissionAnswer);
router.put("/:id", authMiddleware, controller.updateSubmissionAnswer);

module.exports = router;