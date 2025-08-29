// stripe.js
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY || "demo");

async function createCheckoutSession() {
  if (process.env.STRIPE_SECRET_KEY === undefined) {
    throw new Error("Stripe not configured. Add STRIPE_SECRET_KEY to .env");
  }

  return await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Customer Retainer Subscription",
          },
          unit_amount: 22000, // $220 in cents
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });
}

module.exports = { createCheckoutSession };
