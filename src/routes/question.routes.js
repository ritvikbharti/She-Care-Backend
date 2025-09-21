// routes/question.routes.js
const express = require("express");
const router = express.Router();
const Question = require("../models/questions");
const Report = require("../models/report");

//  Get all questions grouped by category
router.get("/", async (req, res) => {
  try {
    const questions = await Question.find();

    // Group questions by category
    const grouped = {};
    questions.forEach((q) => {
      if (!grouped[q.category]) grouped[q.category] = [];
      grouped[q.category].push(q);
    });

    res.json(grouped); // Send object to match frontend expectations
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Error fetching questions", error });
  }
});

// Submit quiz and save report
router.post("/submit", async (req, res) => {
  try {
    const { answers, userId } = req.body;
    if (!userId) return res.status(401).json({ success: false, message: "User not logged in" });

    // 1Calculate score (simple logic, you can improve)
    let score = 0;
    Object.values(answers).forEach((ans) => {
      if (["facial_hair", "mild", "often"].includes(ans.value)) score++;
    });

    // 2 Create report content
    const reportData = {
      user: userId, // Must match your Report schema
      answers,
      report: {
        riskLevel: score > 3 ? "High Risk of PCOD" : "Low to Moderate Risk",
        recommendations: [
          "Consult a gynecologist",
          "Maintain a healthy diet",
          "Track your cycle regularly",
        ],
        totalScore: score,
      },
    };

    //  Save report to MongoDB
    const savedReport = await Report.create(reportData);

    //  Send response
    res.json({ success: true, report: savedReport });
  } catch (error) {
    console.error("Submit quiz error:", error);
    res.status(500).json({ message: "Error generating report", error });
  }
});

module.exports = router;
