// models/user.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // ✅ Store quiz submissions
  quizReports: [
    {
      answers: { type: Object, required: true }, // all selected answers
      report: { type: Object, required: true },  // riskLevel, score, recommendations
      createdAt: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model("User", userSchema);
