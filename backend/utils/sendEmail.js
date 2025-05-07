const nodemailer = require("nodemailer");

const sendResetEmail = async (email, resetToken) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

  await transporter.sendMail({
    from: '"MuseumGo" <prashanthsn6363@gmail.com>',
    to: email,
    subject: "Reset Your Password",
    html: `
      <p>Hello,</p>
      <p>You recently requested to reset your password. Click the link below to proceed:</p>
      <p><a href="${resetLink}">Reset Password</a></p>
      <p>This link will expire in 15 minutes. If you did not request this, you can safely ignore this email.</p>
      <br/>
      <p>Regards,<br/>MuseumGo Support Team</p>
    `,
  });
};

module.exports = sendResetEmail;
