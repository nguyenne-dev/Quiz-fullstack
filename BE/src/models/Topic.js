const mongoose = require("mongoose")

const TopicSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
}, { timestamps: true });

const Topic = mongoose.model("Topic", TopicSchema);

module.exports = Topic;