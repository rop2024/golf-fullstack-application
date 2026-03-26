import express from "express";
import stripe from "../config/stripe.js";
import {
  handleCheckoutCompleted,
  handleInvoicePaymentSucceeded,
  handleSubscriptionDeleted
} from "../services/webhook.service.js";

const router = express.Router();

// Webhook endpoint - must use raw body
router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle events
  try {
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        console.log("Checkout session completed:", session.id);
        await handleCheckoutCompleted(session);
        break;

      case "invoice.payment_succeeded":
        const invoice = event.data.object;
        console.log("Invoice payment succeeded:", invoice.id);
        await handleInvoicePaymentSucceeded(invoice);
        break;

      case "customer.subscription.deleted":
        const subscription = event.data.object;
        console.log("Subscription deleted:", subscription.id);
        await handleSubscriptionDeleted(subscription);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Error handling webhook:", error);
    res.status(500).json({ error: "Webhook handler failed" });
  }
});

export default router;