const axios = require("axios");

async function sendSms(message, number) {
  try {
    const response = await axios.get(
      `https://sms.smsnotifygh.com/smsapi?key=${procces.env.SMS_KEY}&to=${number}&msg=${message}&sender_id=DSGames`,
    );

    return { data: response.data, response: response };
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
module.exports = { sendSms };
