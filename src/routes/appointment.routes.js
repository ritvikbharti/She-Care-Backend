const express = require("express");
const { bookAppointment, getAppointments } = require("../controllers/appointment.controller");
const protect = require("../middlewares/auth");
const router = express.Router();

// user routes
router.post("/", protect, bookAppointment);
router.get("/", protect, getAppointments);

module.exports = router;
