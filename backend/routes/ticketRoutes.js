const express = require("express");
const { createTicket, getUserTickets, cancelTicket, getAllTickets } = require("../controllers/ticketController");
const { authMiddleware, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Route for booking a ticket
router.post("/book", authMiddleware, createTicket);

// Route to get user tickets
router.get("/my-tickets", authMiddleware, getUserTickets);

// Route to cancel a ticket

//router.post('/cancel/:id', cancelTicket);

router.post('/cancel/:id', authMiddleware, cancelTicket);



// Route to get all tickets (admin only)
router.get("/all", authMiddleware, adminOnly, getAllTickets);

module.exports = router;
