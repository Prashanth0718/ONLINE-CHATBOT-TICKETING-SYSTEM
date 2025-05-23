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
const adminRoutes = require("./routes/adminRoutes");
const museumRoutes = require("./routes/museumRoutes");
const verifyRoutes = require("./routes/verifyRoutes");

const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
const corsOptions = {
  origin: process.env.CORS_ORIGINS?.split(","),
  methods: process.env.CORS_METHODS?.split(","),
  allowedHeaders: process.env.CORS_ALLOWED_HEADERS?.split(","),
  credentials: true,
};


app.use(cors(corsOptions));

//app.use(cors());


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
app.use('/api/tickets', require('./routes/ticketRoutes'));
app.use("/api/payment", paymentRoutes);
//app.use("/api/payments", paymentRoutes);
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/analytics", require("./routes/analyticsRoutes"));
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/museums", museumRoutes);
app.use("/api/verify", verifyRoutes);
// Default Route
app.get("/", (req, res) => {
  res.send("Welcome to the Chatbot Ticketing System API");
});

app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(r.route.path);
  }
});



// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

