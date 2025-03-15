const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
//const dotenv = require("dotenv");
require("dotenv").config();
// Import Routes
const authRoutes = require("./routes/authRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const userRoutes = require("./routes/userRoutes");
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:5173", "http://localhost:5174"], // ✅ Added 5174
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Allow cookies/auth headers
};

//app.use(cors(corsOptions));
//const cors = require("cors");
app.use(cors());


app.use(express.json()); // Middleware to parse JSON requests
// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1); // Stop server if DB connection fails
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/analytics", require("./routes/analyticsRoutes"));

app.use("/api/users", userRoutes);
// Default Route
app.get("/", (req, res) => {
  res.send("Welcome to the Chatbot Ticketing System API");
});

app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(r.route.path);
  }
});

const cron = require("node-cron");
const { resetDailyAnalytics, resetMonthlyAnalytics } = require("./controllers/analyticsController");

// 🕛 Schedule daily analytics reset at **midnight (12:00 AM)**
cron.schedule("0 0 * * *", () => {
  console.log("⏰ Running Daily Analytics Reset...");
  resetDailyAnalytics();
});

// 📅 Schedule monthly analytics reset on the **1st of each month at 12:05 AM**
cron.schedule("5 0 1 * *", () => {
  console.log("⏰ Running Monthly Analytics Reset...");
  resetMonthlyAnalytics();
});


// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

