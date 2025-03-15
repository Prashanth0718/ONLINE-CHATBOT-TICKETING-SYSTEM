const User = require("../models/User");
const Ticket = require("../models/Ticket");

// Fetch User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password"); // Exclude password field
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch User's Ticket History
exports.getUserTicketHistory = async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.userId });
    res.status(200).json(tickets);
  } catch (error) {
    console.error("❌ Error fetching ticket history:", error);
    res.status(500).json({ message: "Server error" });
  }
};
