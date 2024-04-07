const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const { sendMail } = require("./smtp");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 8080;

app.post("/smtp", async (req, res) => {
  const { template, enquiry, message, client, enquiryId } = req.body;
  console.log(req.body);

  const response = await sendMail(template, client, {
    message,
    enquiry,
    link: `https://app.app.com/ticket/${enquiryId}`,
  });
  console.log({ ...response });
  return res.json({ ...response });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
