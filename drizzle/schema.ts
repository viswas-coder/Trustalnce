import { decimal, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  userType: mysqlEnum("userType", ["client", "freelancer", "both"]).default("both"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Projects table - represents freelance projects posted by clients
 */
export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  budget: decimal("budget", { precision: 10, scale: 2 }).notNull(),
  deadline: timestamp("deadline").notNull(),
  status: mysqlEnum("status", ["open", "in_progress", "completed", "cancelled", "disputed"]).default("open").notNull(),
  category: varchar("category", { length: 100 }),
  selectedFreelancerId: int("selectedFreelancerId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

/**
 * Applications table - freelancers apply to projects
 */
export const applications = mysqlTable("applications", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  freelancerId: int("freelancerId").notNull(),
  coverLetter: text("coverLetter").notNull(),
  proposedBudget: decimal("proposedBudget", { precision: 10, scale: 2 }),
  status: mysqlEnum("status", ["pending", "accepted", "rejected", "withdrawn"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Application = typeof applications.$inferSelect;
export type InsertApplication = typeof applications.$inferInsert;

/**
 * Escrow table - holds funds for projects
 */
export const escrow = mysqlTable("escrow", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull().unique(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["pending", "held", "released", "refunded", "disputed"]).default("pending").notNull(),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Escrow = typeof escrow.$inferSelect;
export type InsertEscrow = typeof escrow.$inferInsert;

/**
 * Disputes table - handles conflicts between clients and freelancers
 */
export const disputes = mysqlTable("disputes", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull().unique(),
  filedBy: int("filedBy").notNull(),
  reason: text("reason").notNull(),
  evidence: text("evidence"),
  status: mysqlEnum("status", ["open", "under_review", "resolved", "closed"]).default("open").notNull(),
  resolution: text("resolution"),
  llmAnalysis: text("llmAnalysis"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Dispute = typeof disputes.$inferSelect;
export type InsertDispute = typeof disputes.$inferInsert;

/**
 * Transactions table - tracks all payment transactions
 */
export const transactions = mysqlTable("transactions", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  type: mysqlEnum("type", ["deposit", "release", "refund", "dispute_hold"]).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["pending", "completed", "failed"]).default("pending").notNull(),
  stripeTransactionId: varchar("stripeTransactionId", { length: 255 }),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;

/**
 * Milestones table - tracks project milestones and deliverables
 */
export const milestones = mysqlTable("milestones", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  dueDate: timestamp("dueDate").notNull(),
  status: mysqlEnum("status", ["pending", "in_progress", "submitted", "approved", "rejected"]).default("pending").notNull(),
  deliverableUrl: varchar("deliverableUrl", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Milestone = typeof milestones.$inferSelect;
export type InsertMilestone = typeof milestones.$inferInsert;

/**
 * Messages table - tracks communication between clients and freelancers
 */
export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  senderId: int("senderId").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

// Relations - defined after all tables
export const userRelations = relations(users, ({ many }) => ({
  projectsAsClient: many(projects),
  applications: many(applications),
  messagesAsSender: many(messages),
}));

export const projectRelations = relations(projects, ({ one, many }) => ({
  client: one(users, {
    fields: [projects.clientId],
    references: [users.id],
  }),
  selectedFreelancer: one(users, {
    fields: [projects.selectedFreelancerId],
    references: [users.id],
  }),
  applications: many(applications),
  escrow: one(escrow),
  dispute: one(disputes),
  milestones: many(milestones),
  messages: many(messages),
  transactions: many(transactions),
}));

export const applicationRelations = relations(applications, ({ one }) => ({
  project: one(projects, {
    fields: [applications.projectId],
    references: [projects.id],
  }),
  freelancer: one(users, {
    fields: [applications.freelancerId],
    references: [users.id],
  }),
}));

export const escrowRelations = relations(escrow, ({ one }) => ({
  project: one(projects, {
    fields: [escrow.projectId],
    references: [projects.id],
  }),
}));

export const disputeRelations = relations(disputes, ({ one }) => ({
  project: one(projects, {
    fields: [disputes.projectId],
    references: [projects.id],
  }),
  filedByUser: one(users, {
    fields: [disputes.filedBy],
    references: [users.id],
  }),
}));

export const transactionRelations = relations(transactions, ({ one }) => ({
  project: one(projects, {
    fields: [transactions.projectId],
    references: [projects.id],
  }),
}));

export const milestoneRelations = relations(milestones, ({ one }) => ({
  project: one(projects, {
    fields: [milestones.projectId],
    references: [projects.id],
  }),
}));

export const messageRelations = relations(messages, ({ one }) => ({
  project: one(projects, {
    fields: [messages.projectId],
    references: [projects.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
}));
