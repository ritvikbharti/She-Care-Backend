const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },

  // Wallet
  walletBalance: { type: Number, default: 0 },
  transactions: [
    {
      type:      { type: String, enum: ["credit", "debit"], required: true },
      amount:    { type: Number, required: true },
      note:      { type: String },
      razorpayOrderId:   { type: String },
      razorpayPaymentId: { type: String },
      createdAt: { type: Date, default: Date.now },
    },
  ],

  // Quiz reports
  quizReports: [
    {
      answers:   { type: Object, required: true },
      report:    { type: Object, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);