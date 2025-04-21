const express = require("express");
const router = express.Router();
const { getAllUsers, updateUser, resetUserPassword } = require("../controllers/adminController");
const { adminAuthMiddleware } = require("../middleware/authMiddleware");
const Ticket = require("../models/Ticket"); 
const User = require("../models/User");  
const Analytics = require("../models/Analytics");

// ✅ GET all users (Admin only)
router.get("/users", adminAuthMiddleware, getAllUsers);

// ✅ UPDATE user details (Admin only)
router.put("/users/update", adminAuthMiddleware, updateUser);

// ✅ RESET user password (Admin only)
router.post("/users/reset-password/:id", adminAuthMiddleware, resetUserPassword);

// ✅ Get a user's booking history (Admin Only)
router.get("/users/:userId/bookings", adminAuthMiddleware, async (req, res) => {
    try {
        const { userId } = req.params;
        const bookings = await Ticket.find({ userId });

        if (!bookings.length) {
            return res.status(404).json({ message: "No bookings found for this user" });
        }

        res.json(bookings);
    } catch (error) {
        console.error("❌ Error fetching user bookings:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ UPDATE a booking (Admin Only)
router.put("/bookings/:id", adminAuthMiddleware, async (req, res) => {
    console.log("🔍 DELETE /bookings/:id route hit with ID:", req.params.id);
    try {
        const { museumName, visitors, status } = req.body;
        const updatedBooking = await Ticket.findByIdAndUpdate(
            req.params.id, 
            { museumName, visitors, status }, 
            { new: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.json(updatedBooking);
    } catch (error) {
        console.error("❌ Error updating booking:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ DELETE a booking (Admin Only)
router.delete("/bookings/:id", adminAuthMiddleware, async (req, res) => {
    try {
        const deletedBooking = await Ticket.findByIdAndDelete(req.params.id);

        if (!deletedBooking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.json({ message: "✅ Booking deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting booking:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ DELETE a user and all their bookings (Admin Only)
router.delete("/users/:id", adminAuthMiddleware, async (req, res) => {
    try {
        const { id: userId } = req.params;
        console.log("🛑 Deleting User ID:", userId);

        // 🛑 Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // ✅ Delete all user bookings
        const deletedBookings = await Ticket.deleteMany({ userId });
        console.log(`✅ Deleted ${deletedBookings.deletedCount} bookings for User ID: ${userId}`);

        // ✅ Delete the user
        await User.findByIdAndDelete(userId);
        console.log("✅ User deleted successfully");

        // ✅ Update Analytics after user deletion
        const totalBookings = await Ticket.countDocuments();
        const totalRevenueResult = await Ticket.aggregate([{ $group: { _id: null, total: { $sum: "$price" } } }]);
        const totalRevenue = totalRevenueResult[0]?.total || 0;

        const updatedAnalytics = await Analytics.findOneAndUpdate(
            {}, // Update the single analytics document
            { totalBookings, totalRevenue },
            { new: true }
        );

        console.log("📊 Updated Analytics:", updatedAnalytics);

        res.json({ message: "✅ User and related bookings deleted, analytics updated" });
    } catch (error) {
        console.error("❌ Error deleting user and updating analytics:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
