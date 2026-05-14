const express = require("express");
const Report = require("../models/report");
const protect = require("../middlewares/auth"); // ✅ add auth

const router = express.Router();

// ✅ Save report — attaches userId from token if logged in
router.post("/add", async (req, res) => {
  try {
    const { userId, inputs, riskPercentage, detected } = req.body;

    const report = new Report({
      userId: userId || null,
      inputs,
      riskPercentage,
      detected,
    });

    await report.save();
    res.status(201).json({ message: "Report saved successfully", report });
  } catch (error) {
    res.status(500).json({ message: "Failed to save report", error });
  }
});

// ✅ Get reports for the logged-in user only (was returning ALL users' reports before)
router.get("/my", protect, async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reports", error });
  }
});

// ✅ Get all reports — admin use only (keep but don't expose to regular users)
router.get("/all", async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reports", error });
  }
});

// ✅ Delete a report (only owner can delete)
router.delete("/:id", protect, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    // Make sure user owns this report
    if (report.userId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this report" });
    }

    await Report.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete report", error });
  }
});

module.exports = router;