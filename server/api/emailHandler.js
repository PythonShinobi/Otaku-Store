// server/api/emailHandler.js
import nodemailer from "nodemailer";
import env from "dotenv";

env.config();

/**
 * Nodemailer Transporter Configuration
 * 
 * This code sets up a Nodemailer transporter using Gmail as the email service. 
 * Nodemailer is a module for Node.js applications to allow email sending.
 * 
 * - The transporter is configured with the Gmail service.
 * - It uses authentication details provided via environment variables.
 * - `process.env.GMAIL` contains the email address used for sending emails.
 * - `process.env.GMAIL_PASSWORD` contains the password or application-specific password for the Gmail account.
 * 
 * Usage:
 * The transporter can be used to send emails from the configured Gmail account.
 * Ensure that the environment variables `GMAIL` and `GMAIL_PASSWORD` are set correctly in your environment.
 */
export const transporter = nodemailer.createTransport({
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

  // Construct the email options
  const mailOptions = {
    from: email,
    to: process.env.GMAIL,
    subject: "New Contact Message",
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  try {
    // Send the email using the transporter and the constructed mailOptions
    let info = await transporter.sendMail(mailOptions);

    console.log('Email sent:', info.messageId);
    res.send("Email has been sent✔.");
  } catch (error) {
    console.error(`Error sending email: ${error}`);
    res.status(500).send("Failed to send email❌.");
  }
};