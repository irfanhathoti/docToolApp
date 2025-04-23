// // routes/payment.ts
// import express, { Request, Response } from "express";
// import Stripe from "stripe";
// import User from "../models/User";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2023-10-16",
// });
// const router = express.Router();

// router.post("/create-checkout-session", async (req: Request, res:Response) => {
//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ["card"],
//     line_items: [
//       {
//         price_data: {
//           currency: "usd",
//           product_data: { name: "10 Credits" },
//           unit_amount: 500, // $5.00
//         },
//         quantity: 1,
//       },
//     ],
//     mode: "payment",
//     success_url: "http://localhost:3000/payment-success",
//     cancel_url: "http://localhost:3000/payment-cancel",
//   });

//   res.json({ id: session.id });
// });



// export default router;
