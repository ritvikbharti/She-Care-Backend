const Doctor = require("../models/Doctor");

// Get all doctors with optional search/filter
exports.getDoctors = async (req, res) => {
  try {
    const { name, specialization, location } = req.query;

    let filter = {};
    if (name) filter.name = { $regex: name, $options: "i" };
    if (specialization && specialization !== "all") filter.specialization = specialization;
    if (location && location !== "all") filter.location = location;

    const doctors = await Doctor.find(filter);
    res.status(200).json(doctors);
  } catch (err) {
    res.status(500).json({ message: "Error fetching doctors", error: err.message });
  }
};

// Add a new doctor (optional admin functionality)
exports.addDoctor = async (req, res) => {
  try {
    const newDoctor = await Doctor.create(req.body);
    res.status(201).json(newDoctor);
  } catch (err) {
    res.status(500).json({ message: "Error adding doctor", error: err.message });
  }
};
