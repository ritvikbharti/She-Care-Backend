const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  location: { type: String, required: true },
  experience: { type: String, required: true }, // change to String
  rating: { type: Number, required: true },
  fee: { type: Number, required: true },
  status: { type: String, required: true },
  languages: [{ type: String }],
  nextAvailable: { type: String, required: true }, // change to String
});

module.exports = mongoose.model("Doctor", doctorSchema);
