const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const doctorRoutes = require("./routes/doctors.routes");
const appointmentRoutes = require("./routes/appointment.routes");
const questionRoutes = require("./routes/question.routes");
const mlRoutes = require("./routes/ml.routes");
const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/ml", mlRoutes);


app.get("/", (req, res) => res.send("FairyMate Backend Running"));

module.exports = app;