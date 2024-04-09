const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const { sendMail } = require("./smtp");
const cors = require("cors");
const { getUsers } = require("./firebase");
const { sendSms } = require("./sms");
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 8080;

app.post("/smtp", async (req, res) => {
  const { template, enquiry, message, client, enquiryId, clients, subject } =
    req.body;

  if (template === "general" || template === "") {
    // input subject, message, and clients
    if (!clients.length) {
      return res
        .status(400)
        .json({ message: "Please provide a list of clients." });
    }

    const customers_ = await getUsers(clients);

    // Process the email sending in the background
    customers_.forEach((customer) => {
      // Use a non-await call to handle asynchronously
      sendMail(
        template,
        customer.emailAddress,
        { message, subject, ...customer },
        subject,
      )
        .then(() => console.log(`Email sent to ${customer.emailAddress}`))
        .catch((error) =>
          console.error(
            `Failed to send email to ${customer.emailAddress}: ${error}`,
          ),
        );
    });

    // Immediately respond to the request
    return res.status(200).json({ message: "Emails are being sent." });
  }

  const response = await sendMail(template, client, {
    message,
    enquiry,
    link: `https://scout-dev-3214c.web.app/ticket/${enquiryId}`,
  });
  console.log({ ...response });
  return res.json({ ...response });
});

app.post("/sms", async (req, res) => {
  const { message, clients } = req.body;

  try {
    if (!clients.length || message === "") {
      return res
        .status(400)
        .json({ message: "Please provide a list of clients and a message" });
    }

    const customers_ = await getUsers(clients);

    customers_.forEach((customer) => {
      // Use a non-await call to handle asynchronously
      sendSms(message, customer.phoneNumber)
        .then(() => console.log(`SMS sent to ${customer.phoneNumber}`))
        .catch((error) =>
          console.error(
            `Failed to send sms to ${customer.phoneNumber}: ${error}`,
          ),
        );
    });

    // Immediately respond to the request
    return res.status(200).json({ message: "Sms are being sent." });
  } catch (err) {}
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
