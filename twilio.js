// twilio.js
const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID || "demo";
const authToken = process.env.TWILIO_AUTH_TOKEN || "demo";
const fromNumber = process.env.TWILIO_PHONE_NUMBER || "+10000000000";

// If no real credentials, run in simulation mode
let client = null;
if (accountSid !== "demo") {
  client = twilio(accountSid, authToken);
}

async function handleMissedCall(phone) {
  const message = `Sorry we missed your call! Please reply with your name and email so we can follow up.`;

  if (client) {
    await client.messages.create({
      body: message,
      from: fromNumber,
      to: phone,
    });
    console.log(`Sent SMS to ${phone}`);
  } else {
    console.log(`[SIMULATION] Would send SMS to ${phone}: "${message}"`);
  }
}

module.exports = { handleMissedCall };
