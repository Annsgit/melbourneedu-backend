
import { Router } from "express";
import Stripe from "stripe";

const router = Router();

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

router.post("/api/checkout", async (req, res) => {
  try {
    const { line_items } = req.body;

    if (!line_items || !Array.isArray(line_items)) {
      return res.status(400).json({ error: "Missing or invalid line_items" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: "https://melbourne-education-guide.replit.app/success",
      cancel_url: "https://melbourne-education-guide.replit.app/cancel",
    });

    res.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Checkout error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

export default router;
