const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    answers: { type: Object, required: true },
    report: {
      riskLevel: { type: String },
      recommendations: [String],
      totalScore: { type: Number },
    },
  }, { timestamps: true });
  

module.exports = mongoose.model("Report", reportSchema);
