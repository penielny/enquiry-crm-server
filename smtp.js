const nodemailer = require("nodemailer");
const fs = require("fs");

// Function to send an email using Nodemailer with a template
async function sendMail(
  template,
  emailAddress,
  data,
  subject = "You have a response.",
) {
  try {
    // Create a Nodemailer transporter using your email service credentials
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Read the email template file
    const templatePath = `./templates/${template}/index.html`;
    const emailTemplate = fs.readFileSync(templatePath, "utf8");

    // Replace placeholders in the template with provided data
    let formattedEmail = emailTemplate;
    for (const [key, value] of Object.entries(data)) {
      formattedEmail = formattedEmail.replace(
        new RegExp(`{{${key}}}`, "g"),
        value,
      );
    }

    // Send the email
    const info = await transporter.sendMail({
      from: "PHDC (Enquiry) <" + process.env.SMTP_EMAIL + ">",
      to: emailAddress,
      subject: subject,
      html: formattedEmail,
    });
    console.log(`mailer:executed`);
    return { sent: true, message: info.response };
  } catch (error) {
    console.log(`mailer:error`, error);
    return { sent: false, message: error.message };
  }
}

module.exports = { sendMail };
