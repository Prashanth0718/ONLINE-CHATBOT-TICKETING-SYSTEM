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

router.get("/verify/:ticketId", async (req, res) => {
    try {
      const ticket = await Ticket.findById(req.params.ticketId);
  
      if (!ticket) {
        return res.send(`
          <h2 style="color:red; text-align:center;">❌ Ticket not found or invalid.</h2>
        `);
      }
  
      const formattedDate = new Date(ticket.date).toLocaleDateString();
  
      res.send(`
        <div style="max-width:500px;margin:40px auto;padding:20px;border-radius:10px;
                    box-shadow:0 4px 12px rgba(0,0,0,0.1);font-family:sans-serif;">
          <h2 style="color:green;text-align:center;">🎫 Ticket Verified</h2>
          <hr/>
          <p><strong>Museum:</strong> ${ticket.museumName}</p>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Visitors:</strong> ${ticket.visitors}</p>
          <p><strong>Status:</strong> 
            <span style="color:${ticket.status === "cancelled" ? "red" : "green"};">
              ${ticket.status}
            </span>
          </p>
          <p><strong>Payment ID:</strong> ${ticket.paymentId}</p>
          <p><strong>User ID:</strong> ${ticket.userId}</p>
        </div>
      `);
    } catch (err) {
      res.send(`
        <h2 style="color:red;text-align:center;">❌ Error verifying ticket</h2>
        <p style="text-align:center;">${err.message}</p>
      `);
    }
  });
  

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


