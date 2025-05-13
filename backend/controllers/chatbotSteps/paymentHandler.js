const Razorpay = require("razorpay");
const Museum = require("../../models/Museum");


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const handlePaymentStep = async ({ userMessage, session, response }) => {
  if (typeof userMessage !== "string" || !userMessage.toLowerCase().includes("proceed to payment")) {
    response.message = "⚠️ Please click on 'Proceed to Payment 💳' to continue.";
    response.options = ["Proceed to Payment 💳", "⬅️ Go Back"];
    return { session, response };
  }

  try {
    const museum = await Museum.findOne({ name: session.selectedMuseum });
    if (!museum) {
      response.message = "⚠️ Museum not found. Please start again.";
      session.step = "main_menu";
      return { session, response };
    }

    const selectedDate = session.selectedDate;
    const numTickets = session.numTickets || 1;

    let stats = museum.dailyStats.find(stat => stat.date === selectedDate);
    if (!stats) {
      stats = {
        date: selectedDate,
        availableTickets: museum.availableTickets,
        bookedTickets: 0,
      };
      museum.dailyStats.push(stats);
    }

    if (stats.availableTickets < numTickets) {
      response.message = `❌ Sorry, only ${stats.availableTickets} tickets are available for that date.`;
      session.step = "main_menu";
      return { session, response };
    }

    stats.availableTickets -= numTickets;
    stats.bookedTickets += numTickets;
    await museum.save();

    const amount = numTickets * session.selectedTicketPrice * 100;
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    session.paymentDetails = {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      numTickets,
      date: selectedDate,
      museumId: museum._id,
    };

   response.message = `🧾 *Order Created!*\n\nYou're booking *${numTickets}* ticket(s) for *${session.selectedMuseum}* on *${selectedDate}*.\n💵 *Total:* ₹${amount / 100}\n\nPlease complete your payment using Razorpay to confirm your booking.`;
    response.options = ["Pay Now 💳"];

    session.step = "main_menu";
  } catch (error) {
    console.error("❌ Razorpay Payment Error:", error);
    response.message = "⚠️ Failed to initiate payment. Please try again later.";
    response.options = ["⬅️ Go Back", "Restart Chat 🔄"];
    session.step = "main_menu";
  }

  return { session, response };
};

module.exports = handlePaymentStep;
