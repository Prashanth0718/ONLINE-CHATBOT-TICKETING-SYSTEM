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
    from: '"MuseumGo" <prashanthsn6363@gmail.com>',
    to: email,
    subject: "🎫 Ticket Cancellation Confirmation",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 10px;">
        <h2 style="color: #D32F2F;">🎫 Ticket Cancellation Successful</h2>
        <p>Hello,</p>
        <p>Your ticket for <strong>${ticket.museumName}</strong> on <strong>${formattedDate}</strong> has been successfully cancelled.</p>
        <p><strong>Visitors:</strong> ${ticket.visitors}</p>
        <p><strong>Status:</strong> Cancelled</p>
        <p><strong>Ticket ID:</strong> ${ticket._id}</p>
        <p style="margin-top: 10px;">Refund (if applicable) will be processed to your original payment method within 5–7 business days.</p>
        <br>
        <p>Thank you for using our service!</p>
        <p style="font-size: 12px; color: #777;">If you have any questions, feel free to contact our support team.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendCancellationEmail;
