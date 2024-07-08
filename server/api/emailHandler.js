// server/api/email.js
import nodemailer from "nodemailer";
import env from "dotenv";

env.config();

// Create a Nodemailer transporter.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL,
    pass: process.env.GMAIL_PASSWORD
  }
});

// Verify the transporter configuration.
transporter.verify((error, success) => {
  if (error) {
      console.error(`Transporter verification failed: ${error}`);
  } else {
      console.log("Transporter is ready to send emails");
  }
});

/**
 * Sends an email using Nodemailer.
 * @async
 * @param {Express.Request} req - The Express request object.
 * @param {Express.Response} res - The Express response object.
 * @returns {Promise<void>} - A Promise that resolves once the email is sent and a response is sent back.
 */
export const sendEmail = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    let info = await transporter.sendMail({
      from: email,
      to: process.env.GMAIL,
      subject: "New Contact Message",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });

    console.log('Email sent:', info.messageId);
    res.send("Email has been sent✔.");
  } catch (error) {
    console.error(`Error sending email: ${error}`);
    res.status(500).send("Failed to send email❌.");
  }
};