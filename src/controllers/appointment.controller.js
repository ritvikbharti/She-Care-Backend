const Appointment = require("../models/appointment");
const Doctor = require("../models/doctors");

// book an appointment
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, timeSlot } = req.body;
    const userId = req.user._id;

    // check if slot is already booked
    const existing = await Appointment.findOne({ doctor: doctorId, date, timeSlot });
    if (existing) {
      return res.status(400).json({ message: "time slot already booked" });
    }

    const appointment = await Appointment.create({
      user: userId,
      doctor: doctorId,
      date,
      timeSlot,
    });

    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: "error booking appointment", error: err.message });
  }
};

// get appointments for logged-in user
exports.getAppointments = async (req, res) => {
  try {
    const userId = req.user._id;
    const appointments = await Appointment.find({ user: userId }).populate("doctor");
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ message: "error fetching appointments", error: err.message });
  }
};
