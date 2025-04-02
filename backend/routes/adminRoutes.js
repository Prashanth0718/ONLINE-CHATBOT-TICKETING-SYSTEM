const express = require("express");
const router = express.Router();
const { getAllUsers, updateUser, resetUserPassword } = require("../controllers/adminController");
const { adminAuthMiddleware } = require("../middleware/authMiddleware");
console.log({ getAllUsers, updateUser, resetUserPassword });
const Ticket = require("../models/Ticket"); 
// GET all users (Admin only)
router.get("/users", adminAuthMiddleware, getAllUsers);

// UPDATE user details (Admin only)
router.put("/users/update", adminAuthMiddleware, updateUser);

// RESET user password (Admin only)
router.post("/users/reset-password/:id", adminAuthMiddleware, resetUserPassword);



// Get a user's booking history (Admin Only)
router.get("/users/:userId/bookings", adminAuthMiddleware, async (req, res) => {
    try {
        const { userId } = req.params;

        // ✅ Ensure Ticket model exists in your project
        const bookings = await Ticket.find({ userId });

        res.json(bookings);
    } catch (error) {
        console.error("Error fetching user bookings:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

  
module.exports = router;
