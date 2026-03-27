import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import Stripe from "stripe";
import { getProjectById, getUserById, getEscrowByProjectId } from "../db";
import { getEscrowCheckoutConfig } from "./products";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export const stripeRouter = router({
  // Create a checkout session for escrow deposit
  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        projectId: z.number(),
        amount: z.number().min(0.5), // Stripe minimum
      })
    )
    .mutation(async ({ ctx, input }) => {
      const project = await getProjectById(input.projectId);
      if (!project) {
        throw new Error("Project not found");
      }

      // Only the client can deposit funds
      if (project.clientId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      const user = await getUserById(ctx.user.id);
      if (!user) {
        throw new Error("User not found");
      }

      // Check if escrow already exists and is held
      const existingEscrow = await getEscrowByProjectId(input.projectId);
      if (existingEscrow && existingEscrow.status === "held") {
        throw new Error("Escrow already funded for this project");
      }

      try {
        const config = getEscrowCheckoutConfig(
          input.projectId,
          input.amount,
          user.email || "",
          user.name || "",
          ctx.user.id
        );

        const session = await stripe.checkout.sessions.create({
          ...config,
          success_url: `${ctx.req.headers.origin}/project/${input.projectId}?payment=success`,
          cancel_url: `${ctx.req.headers.origin}/project/${input.projectId}?payment=cancelled`,
        });

        return {
          sessionId: session.id,
          url: session.url,
        };
      } catch (error: any) {
        console.error("[Stripe] Checkout session creation failed:", error);
        throw new Error(`Failed to create checkout session: ${error.message}`);
      }
    }),

  // Get payment history for a project
  getPaymentHistory: publicProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ input }) => {
      try {
        // Fetch transactions from database
        // This will be populated by webhook events
        return {
          success: true,
        };
      } catch (error: any) {
        console.error("[Stripe] Failed to fetch payment history:", error);
        throw new Error("Failed to fetch payment history");
      }
    }),

  // Get Stripe publishable key for frontend
  getPublishableKey: publicProcedure.query(() => {
    return {
      publishableKey: process.env.VITE_STRIPE_PUBLISHABLE_KEY || "",
    };
  }),
});

export type StripeRouter = typeof stripeRouter;
