const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  option: { type: String, required: true },
  value: { type: String, required: true }
});

const questionSchema = new mongoose.Schema({
  category: { type: String, required: true }, // Symptoms, Mental, etc.
  question: { type: String, required: true },
  options: [optionSchema]
});

module.exports = mongoose.model("Question", questionSchema);
