const express = require("express");
const Doctor = require("../models/doctors");
const router = express.Router();

// get all doctors
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (err) {
    res.status(500).json({ message: "error fetching doctors", error: err.message });
  }
});

module.exports = router;
