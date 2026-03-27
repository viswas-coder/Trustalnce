import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { stripeRouter } from "./stripe/router";
import { disputeRouter } from "./disputes/router";
import { z } from "zod";
import {
  getProjectById,
  getProjectsByClientId,
  getOpenProjects,
  createProject,
  getApplicationsByProjectId,
  getApplicationsByFreelancerId,
  createApplication,
  updateApplicationStatus,
  getEscrowByProjectId,
  createEscrow,
  updateEscrowStatus,
  getDisputeByProjectId,
  createDispute,
  getTransactionsByProjectId,
  createTransaction,
  getMilestonesByProjectId,
  createMilestone,
  getMessagesByProjectId,
  createMessage,
  getUserById,
  updateUserType,
} from "./db";

export const appRouter = router({
  system: systemRouter,
  stripe: stripeRouter,
  disputes: disputeRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    setUserType: protectedProcedure
      .input(z.object({ userType: z.enum(["client", "freelancer", "both"]) }))
      .mutation(async ({ ctx, input }) => {
        await updateUserType(ctx.user.id, input.userType);
        return { success: true };
      }),
  }),

  // Projects Router
  projects: router({
    list: publicProcedure.query(async () => {
      return await getOpenProjects();
    }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getProjectById(input.id);
      }),
    getByClient: protectedProcedure.query(async ({ ctx }) => {
      return await getProjectsByClientId(ctx.user.id);
    }),
    create: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1),
          description: z.string().min(1),
          budget: z.string(),
          deadline: z.date(),
          category: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await createProject({
          clientId: ctx.user.id,
          title: input.title,
          description: input.description,
          budget: input.budget as any,
          deadline: input.deadline,
          category: input.category,
          status: "open",
        });
        return { success: true };
      }),
    updateStatus: protectedProcedure
      .input(z.object({ projectId: z.number(), status: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const project = await getProjectById(input.projectId);
        if (!project || project.clientId !== ctx.user.id) {
          throw new Error("Unauthorized");
        }
        // Update project status
        return { success: true };
      }),
  }),

  // Applications Router
  applications: router({
    getByProject: publicProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input }) => {
        return await getApplicationsByProjectId(input.projectId);
      }),
    getByFreelancer: protectedProcedure.query(async ({ ctx }) => {
      return await getApplicationsByFreelancerId(ctx.user.id);
    }),
    submit: protectedProcedure
      .input(
        z.object({
          projectId: z.number(),
          coverLetter: z.string().min(1),
          proposedBudget: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await createApplication({
          projectId: input.projectId,
          freelancerId: ctx.user.id,
          coverLetter: input.coverLetter,
          proposedBudget: input.proposedBudget as any,
          status: "pending",
        });
        return { success: true };
      }),
    accept: protectedProcedure
      .input(z.object({ applicationId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await updateApplicationStatus(input.applicationId, "accepted");
        return { success: true };
      }),
    reject: protectedProcedure
      .input(z.object({ applicationId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await updateApplicationStatus(input.applicationId, "rejected");
        return { success: true };
      }),
  }),

  // Escrow Router
  escrow: router({
    getByProject: publicProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input }) => {
        return await getEscrowByProjectId(input.projectId);
      }),
    deposit: protectedProcedure
      .input(z.object({ projectId: z.number(), amount: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const project = await getProjectById(input.projectId);
        if (!project || project.clientId !== ctx.user.id) {
          throw new Error("Unauthorized");
        }

        await createEscrow({
          projectId: input.projectId,
          amount: input.amount as any,
          status: "pending",
        });

        // Create transaction record
        await createTransaction({
          projectId: input.projectId,
          type: "deposit",
          amount: input.amount as any,
          status: "pending",
          description: "Escrow deposit",
        });

        return { success: true };
      }),
    release: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const project = await getProjectById(input.projectId);
        if (!project || project.clientId !== ctx.user.id) {
          throw new Error("Unauthorized");
        }

        const escrowRecord = await getEscrowByProjectId(input.projectId);
        if (!escrowRecord) {
          throw new Error("No escrow found");
        }

        await updateEscrowStatus(input.projectId, "released");

        // Create transaction record
        await createTransaction({
          projectId: input.projectId,
          type: "release",
          amount: escrowRecord.amount,
          status: "completed",
          description: "Payment released to freelancer",
        });

        return { success: true };
      }),
    refund: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const project = await getProjectById(input.projectId);
        if (!project || project.clientId !== ctx.user.id) {
          throw new Error("Unauthorized");
        }

        const escrowRecord = await getEscrowByProjectId(input.projectId);
        if (!escrowRecord) {
          throw new Error("No escrow found");
        }

        await updateEscrowStatus(input.projectId, "refunded");

        // Create transaction record
        await createTransaction({
          projectId: input.projectId,
          type: "refund",
          amount: escrowRecord.amount,
          status: "completed",
          description: "Escrow refunded to client",
        });

        return { success: true };
      }),
  }),



  // Milestones Router
  milestones: router({
    getByProject: publicProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input }) => {
        return await getMilestonesByProjectId(input.projectId);
      }),
    create: protectedProcedure
      .input(
        z.object({
          projectId: z.number(),
          title: z.string().min(1),
          description: z.string().optional(),
          dueDate: z.date(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const project = await getProjectById(input.projectId);
        if (!project || project.clientId !== ctx.user.id) {
          throw new Error("Unauthorized");
        }

        await createMilestone({
          projectId: input.projectId,
          title: input.title,
          description: input.description,
          dueDate: input.dueDate,
          status: "pending",
        });

        return { success: true };
      }),
  }),

  // Messages Router
  messages: router({
    getByProject: publicProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input }) => {
        return await getMessagesByProjectId(input.projectId);
      }),
    send: protectedProcedure
      .input(z.object({ projectId: z.number(), content: z.string().min(1) }))
      .mutation(async ({ ctx, input }) => {
        const project = await getProjectById(input.projectId);
        if (!project) {
          throw new Error("Project not found");
        }

        // Only client or selected freelancer can send messages
        if (project.clientId !== ctx.user.id && project.selectedFreelancerId !== ctx.user.id) {
          throw new Error("Unauthorized");
        }

        await createMessage({
          projectId: input.projectId,
          senderId: ctx.user.id,
          content: input.content,
        });

        return { success: true };
      }),
  }),

  // Transactions Router
  transactions: router({
    getByProject: publicProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input }) => {
        return await getTransactionsByProjectId(input.projectId);
      }),
  }),
});

export type AppRouter = typeof appRouter;
