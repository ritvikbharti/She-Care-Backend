const express = require("express");
const Report = require("../models/report");

const router = express.Router();


// ✅ Save report
router.post("/add", async (req, res) => {
  try {
    const report = new Report(req.body);
    await report.save();

    res.status(201).json({
      message: "Report saved successfully",
      report
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to save report",
      error
    });
  }
});


// ✅ Get all reports (latest first)
router.get("/all", async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch reports",
      error
    });
  }
});


// ✅ Delete a report
router.delete("/:id", async (req, res) => {
  try {
    await Report.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Report deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete report",
      error
    });
  }
});

module.exports = router;