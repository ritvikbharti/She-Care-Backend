const dotenv = require("dotenv");
const app = require("./app");
const connectDB = require("./config/database");

dotenv.config();

// Connect to DB
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(` Server running on http://localhost:${PORT}`)
);