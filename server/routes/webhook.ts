
import { Router } from "express";
import Stripe from "stripe";
import sgMail from "@sendgrid/mail";
import { db } from "../db";
import { purchases } from "../schema";

const router = Router();

// Initialize Stripe and SendGrid
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

router.post("/webhook", async (req, res) => {
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      req.headers["stripe-signature"] as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );

    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Fetch line items for the purchase details
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 });
        const email = session.customer_details?.email;
        const productName = lineItems.data[0]?.description ?? "Premium Subscription";

        // Record purchase in database
        if (email) {
          await db.insert(purchases).values({
            id: session.id,
            email: email,
            product: productName,
            createdAt: new Date()
          });

          // Send email receipt
          await sgMail.send({
            to: email,
            from: process.env.SENDGRID_FROM_EMAIL as string,
            subject: "Thanks for your purchase from Melbourne Education Guide!",
            html: `
              <h1>Thank you for your purchase!</h1>
              <p>You purchased: ${productName}</p>
              <p>Your transaction ID: ${session.id}</p>
              <p>If you have any questions, please don't hesitate to contact us.</p>
            `
          });
        }
        break;
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error("Webhook Error:", error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

export default router;
