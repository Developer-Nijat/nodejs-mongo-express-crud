const nodemailer = require("nodemailer");
const config = require("config.json");

async function sendEmail({ to, subject, html, from = config.emailFrom }) {
  const transporter = nodemailer.createTransport(config.smtpOptions);
  await transporter.sendMail({ from, to, subject, html });
}

module.exports = sendEmail;
