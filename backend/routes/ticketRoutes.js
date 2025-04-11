const express = require("express");
const Ticket = require("../models/Ticket");

const { 
    createTicket, 
    getUserTickets, 
    cancelTicket, 
    getAllTickets,
    updateTicket
} = require("../controllers/ticketController");
const { authMiddleware, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Get All Tickets (Admin Only)
router.get("/all", authMiddleware, adminOnly, getAllTickets);

router.get("/", getAllTickets);

// ✅ Book a Ticket (Requires Auth)
router.post("/book", authMiddleware, createTicket);

// ✅ Get User's Tickets (Requires Auth)
router.get("/my-tickets", authMiddleware, getUserTickets);

// ✅ Cancel a Ticket (Requires Auth)
router.delete("/cancel/:id", authMiddleware, cancelTicket);

router.put("/:id", authMiddleware, adminOnly, updateTicket);

// router.put("/:id", authMiddleware, adminOnly, async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { status, museumName, date, visitors } = req.body;

//         const updateFields = { updatedAt: new Date() };

//         if (status) updateFields.status = status;
//         if (museumName) updateFields.museumName = museumName;
//         if (date) updateFields.date = date;
//         if (visitors) updateFields.visitors = visitors;

//         const updatedTicket = await Ticket.findByIdAndUpdate(
//             id,
//             updateFields,
//             { new: true }
//         );

//         if (!updatedTicket) {
//             return res.status(404).json({ error: "Ticket not found" });
//         }

//         res.status(200).json(updatedTicket);
//     } catch (error) {
//         console.error("Error updating ticket:", error);
//         res.status(500).json({ error: "Error updating ticket" });
//     }
// });

module.exports = router;


