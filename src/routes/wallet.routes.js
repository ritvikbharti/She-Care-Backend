const express = require("express");
const Razorpay = require("razorpay");
const crypto  = require("crypto");
const protect = require("../middlewares/auth");
const User    = require("../models/user");

const router = express.Router();

// Lazy init — called inside handlers so process.env is already loaded
function getRazorpay() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set in .env");
  }
  return new Razorpay({
    key_id:     process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}



// ── GET /api/wallet/balance ─────────────────────────────────────────────────
// Returns current wallet balance + last 20 transactions
router.get("/balance", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("walletBalance transactions");
    res.json({
      balance:      user.walletBalance,
      transactions: user.transactions.slice(-20).reverse(), // latest first
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch balance", error: err.message });
  }
});

// ── POST /api/wallet/create-order ───────────────────────────────────────────
// Creates a Razorpay order; frontend opens the checkout with this orderId
router.post("/create-order", protect, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount < 1) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const razorpay = getRazorpay();

    const receipt = `w_${req.user._id.toString().slice(0, 10)}_${Date.now()}`;

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt,
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Razorpay order error:", err);
    res.status(500).json({ message: "Failed to create order", error: err.message });
  }
});

// ── POST /api/wallet/verify ──────────────────────────────────────────────────
// Verifies Razorpay signature, then credits wallet
router.post("/verify", protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = req.body;

    // 1. Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // 2. Credit wallet
    const amountInRupees = amount / 100;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $inc: { walletBalance: amountInRupees },
        $push: {
          transactions: {
            type:              "credit",
            amount:            amountInRupees,
            note:              "Wallet top-up via Razorpay",
            razorpayOrderId:   razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
          },
        },
      },
      { new: true }
    );

    res.json({
      message:    "Payment successful! Wallet credited.",
      balance:    user.walletBalance,
    });
  } catch (err) {
    console.error("Verify error:", err);
    res.status(500).json({ message: "Verification failed", error: err.message });
  }
});

router.post("/debit", protect, async (req, res) => {
  try {
    const { amount, note } = req.body;

    if (!amount || amount < 1) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const user = await User.findById(req.user._id);

    if (user.walletBalance < amount) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    user.walletBalance -= amount;

    user.transactions.push({
      type: "debit",
      amount,
      note: note || "Wallet Debit",
    });

    await user.save();

    res.json({
      message: "Amount debited successfully",
      balance: user.walletBalance,
    });
  } catch (err) {
    res.status(500).json({ message: "Debit failed", error: err.message });
  }
});

module.exports = router;