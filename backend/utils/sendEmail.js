const nodemailer = require("nodemailer");

const sendResetEmail = async (email, resetToken) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // or your provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
// const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
  await transporter.sendMail({
    to: email,
    subject: "Password Reset",
    html: `
      <p>You requested a password reset</p>
      <p><a href="${resetLink}">Click here to reset your password</a></p>
    `,
  });
};

module.exports = sendResetEmail;
