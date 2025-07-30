const express = require("express");
const router = express.Router();
const topicController = require("../controllers/topic.Controller");
const authMiddleware = require("../middlewares/authMiddleware");
const checkAdmin = require("../middlewares/checkAdmin")

router.get("/", topicController.getAllTopic)
router.post("/", authMiddleware, checkAdmin, topicController.addTopic)
router.put("/:id", authMiddleware, checkAdmin, topicController.updateTopic)
router.delete("/:id", authMiddleware, checkAdmin, topicController.deleteTopic)


module.exports = router;