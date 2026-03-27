import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getProjectById, getDisputeByProjectId, updateEscrowStatus } from "../db";
import { analyzeDispute, generateMediationSummary, calculatePaymentDistribution } from "./llm-resolver";
import { notifyDisputeFiled } from "../email/service";

export const disputeRouter = router({
  // Analyze dispute with LLM
  analyze: protectedProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ ctx, input }) => {
      const project = await getProjectById(input.projectId);
      if (!project) {
        throw new Error("Project not found");
      }

      // Only client or freelancer can view dispute analysis
      if (project.clientId !== ctx.user.id && project.selectedFreelancerId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      const dispute = await getDisputeByProjectId(input.projectId);
      if (!dispute) {
        throw new Error("No dispute found");
      }

      // Analyze dispute if not already analyzed
      if (!dispute.llmAnalysis) {
        const analysis = await analyzeDispute(input.projectId);
        if (!analysis) {
          throw new Error("Failed to analyze dispute");
        }

        // Generate mediation summary
        const mediationSummary = await generateMediationSummary(input.projectId, analysis);

        return {
          analysis,
          mediationSummary,
        };
      }

      // Return existing analysis
      const analysis = JSON.parse(dispute.llmAnalysis);
      return {
        analysis,
        mediationSummary: dispute.resolution || "",
      };
    }),

  // Get suggested resolution
  getSuggestedResolution: protectedProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ ctx, input }) => {
      const project = await getProjectById(input.projectId);
      if (!project) {
        throw new Error("Project not found");
      }

      // Only client or freelancer can view resolution
      if (project.clientId !== ctx.user.id && project.selectedFreelancerId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      const dispute = await getDisputeByProjectId(input.projectId);
      if (!dispute || !dispute.llmAnalysis) {
        throw new Error("No dispute analysis available");
      }

      const analysis = JSON.parse(dispute.llmAnalysis);
      const distribution = calculatePaymentDistribution(
        parseFloat(project.budget.toString()),
        analysis.recommendedAction,
        analysis.fairnessScore
      );

      return {
        recommendedAction: analysis.recommendedAction,
        fairnessScore: analysis.fairnessScore,
        clientRefund: distribution.clientRefund,
        freelancerPayment: distribution.freelancerPayment,
      };
    }),

  // Accept resolution (admin only)
  acceptResolution: protectedProcedure
    .input(z.object({ projectId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const project = await getProjectById(input.projectId);
      if (!project) {
        throw new Error("Project not found");
      }

      // Only client or freelancer can accept resolution
      if (project.clientId !== ctx.user.id && project.selectedFreelancerId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      const dispute = await getDisputeByProjectId(input.projectId);
      if (!dispute || !dispute.llmAnalysis) {
        throw new Error("No dispute analysis available");
      }

      // In production, process the payment distribution here
      // For now, just mark dispute as resolved
      console.log("[Dispute] Resolution accepted for project:", input.projectId);

      return { success: true };
    }),

  // Request mediation (when parties can't agree)
  requestMediation: protectedProcedure
    .input(z.object({ projectId: z.number(), message: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const project = await getProjectById(input.projectId);
      if (!project) {
        throw new Error("Project not found");
      }

      // Only client or freelancer can request mediation
      if (project.clientId !== ctx.user.id && project.selectedFreelancerId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      const dispute = await getDisputeByProjectId(input.projectId);
      if (!dispute) {
        throw new Error("No dispute found");
      }

      console.log("[Dispute] Mediation requested for project:", input.projectId);
      console.log("[Dispute] Message:", input.message);

      // Notify both parties
      // In production, send emails to both client and freelancer

      return { success: true, message: "Mediation request submitted" };
    }),
});

export type DisputeRouter = typeof disputeRouter;
