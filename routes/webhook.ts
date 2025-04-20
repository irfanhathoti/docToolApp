import express, { Request, Response } from "express";
import User from "../models/User";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const router = express.Router();
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response): Promise<any> => {
    const sig = req.headers["stripe-signature"]!;
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;
      const userId = session.metadata.userId;

      const user = await User.findById(userId);
      if (user) {
        user.credits += 10;
        user.plan = "PRO";
        await user.save();
      }
    }

    res.status(200).json({ received: true });
  }
);

export default router;
