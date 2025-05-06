const nodemailer = require("nodemailer");

const sendCancellationEmail = async (email, ticket) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const formattedDate = new Date(ticket.date).toDateString();

  const mailOptions = {
    to: email,
    subject: "Ticket Cancellation Confirmation",
    html: `
      <h2>🎫 Ticket Cancellation Successful</h2>
      <p>Your ticket for <strong>${ticket.museumName}</strong> on <strong>${formattedDate}</strong> has been cancelled.</p>
      <p>Visitors: ${ticket.visitors}</p>
      <p>Status: Cancelled</p>
      <p>Refund (if applicable) will be processed to your original payment method.</p>
      <br>
      <p>Thank you for using our service!</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendCancellationEmail;
