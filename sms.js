const axios = require("axios");

async function sendSms(message, number) {
  try {
    const response = await axios.get(
      `https://sms.smsnotifygh.com/smsapi?key=${process.env.SMS_KEY}&to=${number}&msg=${message}&sender_id=DSGames`,
    );
    console.log(`sms:executed`);
    return { data: response.data, response: response };
  } catch (error) {
    console.error("SMS Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
module.exports = { sendSms };
