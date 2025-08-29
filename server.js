// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./db");
const twilioHandler = require("./twilio");
const stripeHandler = require("./stripe");

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Root check
app.get("/", (req, res) => {
  res.json({ message: "Customer Retainer Backend Running" });
});

// Leads API
app.get("/api/leads", async (req, res) => {
  const leads = await db.getLeads();
  res.json(leads);
});

app.post("/api/leads", async (req, res) => {
  const { name, phone, email } = req.body;
  const newLead = await db.addLead(name, phone, email);
  res.json(newLead);
});

// Twilio missed call webhook (simulated)
app.post("/api/twilio/missed-call", async (req, res) => {
  const { phone } = req.body;
  await twilioHandler.handleMissedCall(phone);
  res.json({ success: true });
});

// Stripe checkout
app.post("/api/checkout", async (req, res) => {
  try {
    const session = await stripeHandler.createCheckoutSession();
    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
