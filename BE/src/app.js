const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDB } = require("./config/database");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

connectDB(process.env.MONGO_URI);

// Healthcheck
app.get("/health", (req, res) => res.json({ ok: true }));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/usersRoutes"));
app.use("/api/clubs", require("./routes/clubsRoutes"));
app.use("/api/events", require("./routes/eventsRoutes"));
app.use("/api/registrations", require("./routes/registrationsRoutes"));
app.use("/api/notifications", require("./routes/notificationsRoutes"));

// Not found
app.use((req, res) => res.status(404).json({ message: "Not found" }));

// Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
