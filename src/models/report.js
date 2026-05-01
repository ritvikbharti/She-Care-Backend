const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false
  },

  inputs: {
    BMI: Number,
    Cycle_length: Number,
    FSH: Number,
    LH: Number,
    FSH_LH: Number,
    AMH: Number,
    Follicle_No_L: Number,
    Follicle_No_R: Number,
    Endometrium: Number
  },

  riskPercentage: {
    type: Number,
    required: true
  },

  detected: {
    type: Boolean,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Report", reportSchema);