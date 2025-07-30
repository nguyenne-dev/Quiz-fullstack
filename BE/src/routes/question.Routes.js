const express = require("express");
const router = express.Router();
const questionController = require("../controllers/question.Controller");
const authMiddleware = require("../middlewares/authMiddleware");
const checkAdmin = require("../middlewares/checkAdmin")

router.get("/all", authMiddleware, checkAdmin, questionController.getQuestion);
router.get("/", authMiddleware, questionController.getQuestionTopic);
router.post("/", authMiddleware, checkAdmin, questionController.addQuestion);
router.patch("/:id", authMiddleware, checkAdmin, questionController.updateQuestion);
router.delete("/:id", authMiddleware, checkAdmin, questionController.deleteQuestion);

module.exports = router;