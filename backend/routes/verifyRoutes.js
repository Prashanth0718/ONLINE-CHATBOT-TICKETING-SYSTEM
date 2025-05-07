// routes/verifyRoutes.js
const express = require('express');
const Ticket = require('../models/Ticket');
const router = express.Router();

router.get('/verify/:ticketId', async (req, res) => {
  try {
    const { ticketId } = req.params;
    const ticket = await Ticket.findById(ticketId).populate('userId', 'name email');

    if (!ticket) {
      return res.status(404).send('❌ Ticket not found');
    }

    res.json({
      status: ticket.status,
      museum: ticket.museumName,
      date: ticket.date,
      visitors: ticket.visitors,
      bookedBy: ticket.userId,
      paymentId: ticket.paymentId,
    });
  } catch (err) {
    console.error('Verification error:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
