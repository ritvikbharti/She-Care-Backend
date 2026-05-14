const Appointment = require("../models/appointment");
const Doctor = require("../models/doctors");
const User = require("../models/user");

// book an appointment (with wallet deduction)
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, timeSlot } = req.body;
    const userId = req.user._id;

    if (!doctorId || !date || !timeSlot) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // check if slot already booked
    const existing = await Appointment.findOne({
      doctor: doctorId,
      date: new Date(date),
      timeSlot,
      status: "booked",
    });

    if (existing) {
      return res.status(400).json({ message: "Time slot already booked" });
    }

    // get user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // wallet check
    if (user.walletBalance < doctor.fee) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    // deduct money
    user.walletBalance -= doctor.fee;

    user.transactions.push({
      type: "debit",
      amount: doctor.fee,
      note: `Appointment booked with Dr. ${doctor.name}`,
    });

    await user.save();

    // create appointment
    const appointment = await Appointment.create({
      user: userId,
      doctor: doctorId,
      date: new Date(date),
      timeSlot,
      status: "booked",
    });

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment,
      balance: user.walletBalance,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error booking appointment",
      error: err.message,
    });
  }
};

// get appointments for logged-in user
exports.getAppointments = async (req, res) => {
  try {
    const userId = req.user._id;

    const appointments = await Appointment.find({ user: userId })
      .populate("doctor")
      .sort({ createdAt: -1 });

    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching appointments",
      error: err.message,
    });
  }
};