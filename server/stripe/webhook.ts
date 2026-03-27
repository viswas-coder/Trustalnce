import Stripe from "stripe";
import { Request, Response } from "express";
import { updateEscrowStatus, createTransaction, getProjectById } from "../db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error("[Webhook] Signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle test events for verification
  if (event.id.startsWith("evt_test_")) {
    console.log("[Webhook] Test event detected, returning verification response");
    return res.json({
      verified: true,
    });
  }

  console.log(`[Webhook] Processing event: ${event.type} (${event.id})`);

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case "charge.refunded":
        await handleChargeRefunded(event.data.object as Stripe.Charge);
        break;

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("[Webhook] Error processing event:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log("[Webhook] Checkout session completed:", session.id);

  const projectId = session.metadata?.project_id ? parseInt(session.metadata.project_id) : null;
  const userId = session.metadata?.user_id ? parseInt(session.metadata.user_id) : null;

  if (!projectId || !userId) {
    console.error("[Webhook] Missing project_id or user_id in metadata");
    return;
  }

  const project = await getProjectById(projectId);
  if (!project) {
    console.error("[Webhook] Project not found:", projectId);
    return;
  }

  // Update escrow status to held
  await updateEscrowStatus(projectId, "held");

  // Create transaction record
  const amount = (session.amount_total || 0) / 100; // Convert from cents
  await createTransaction({
    projectId,
    type: "deposit",
    amount: amount.toString() as any,
    status: "completed",
    stripeTransactionId: session.payment_intent?.toString(),
    description: `Escrow deposit via Stripe checkout session ${session.id}`,
  });

  console.log("[Webhook] Escrow updated for project:", projectId);
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log("[Webhook] Payment intent succeeded:", paymentIntent.id);

  // Extract metadata
  const projectId = paymentIntent.metadata?.project_id ? parseInt(paymentIntent.metadata.project_id) : null;

  if (!projectId) {
    console.log("[Webhook] No project_id in payment intent metadata");
    return;
  }

  // Update escrow status if needed
  const project = await getProjectById(projectId);
  if (project) {
    console.log("[Webhook] Payment succeeded for project:", projectId);
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log("[Webhook] Payment intent failed:", paymentIntent.id);

  const projectId = paymentIntent.metadata?.project_id ? parseInt(paymentIntent.metadata.project_id) : null;

  if (!projectId) {
    console.log("[Webhook] No project_id in failed payment intent");
    return;
  }

  // Create failed transaction record
  const amount = (paymentIntent.amount || 0) / 100; // Convert from cents
  await createTransaction({
    projectId,
    type: "deposit",
    amount: amount.toString() as any,
    status: "failed",
    stripeTransactionId: paymentIntent.id,
    description: `Payment failed: ${paymentIntent.last_payment_error?.message || "Unknown error"}`,
  });

  console.log("[Webhook] Payment failed for project:", projectId);
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  console.log("[Webhook] Charge refunded:", charge.id);

  const projectId = charge.metadata?.project_id ? parseInt(charge.metadata.project_id) : null;

  if (!projectId) {
    console.log("[Webhook] No project_id in refunded charge");
    return;
  }

  // Update escrow status to refunded
  await updateEscrowStatus(projectId, "refunded");

  // Create refund transaction record
  const amount = (charge.amount_refunded || 0) / 100; // Convert from cents
  await createTransaction({
    projectId,
    type: "refund",
    amount: amount.toString() as any,
    status: "completed",
    stripeTransactionId: charge.id,
    description: `Refund processed for charge ${charge.id}`,
  });

  console.log("[Webhook] Refund processed for project:", projectId);
}
