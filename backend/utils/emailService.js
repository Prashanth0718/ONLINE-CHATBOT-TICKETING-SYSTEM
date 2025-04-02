const nodemailer = require("nodemailer");
const fs = require("fs");

const sendEmail = async (to, subject, text, html, attachmentPath) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    if (!fs.existsSync(attachmentPath)) {
      console.error("❌ Attachment file not found:", attachmentPath);
      return;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
      attachments: [
        {
          filename: "ticket.pdf",
          path: attachmentPath,
        },
      ],
    };

    console.log("📧 Sending email to:", to);
    await transporter.sendMail(mailOptions);
    console.log("✅ Email Sent Successfully to:", to);
  } catch (error) {
    console.error("❌ Email Sending Failed:", error);
  }
};

module.exports = sendEmail;
