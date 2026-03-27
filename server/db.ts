import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { InsertUser, users, projects, InsertProject, applications, InsertApplication, escrow, InsertEscrow, disputes, InsertDispute, transactions, InsertTransaction, milestones, InsertMilestone, messages, InsertMessage } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const client = createClient({
        url: process.env.DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
      });
      _db = drizzle(client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserType(id: number, userType: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(users).set({ userType: userType as any }).where(eq(users.id, id));
}

// Projects
export async function getProjectById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  return result[0];
}

export async function getProjectsByClientId(clientId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(projects).where(eq(projects.clientId, clientId));
}

export async function getOpenProjects() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(projects).where(eq(projects.status, "open"));
}

export async function createProject(data: InsertProject) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(projects).values(data);
  return result;
}

// Applications
export async function getApplicationsByProjectId(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(applications).where(eq(applications.projectId, projectId));
}

export async function getApplicationsByFreelancerId(freelancerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(applications).where(eq(applications.freelancerId, freelancerId));
}

export async function createApplication(data: InsertApplication) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(applications).values(data);
}

export async function updateApplicationStatus(id: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(applications).set({ status: status as any }).where(eq(applications.id, id));
}

// Escrow
export async function getEscrowByProjectId(projectId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(escrow).where(eq(escrow.projectId, projectId)).limit(1);
  return result[0];
}

export async function createEscrow(data: InsertEscrow) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(escrow).values(data);
}

export async function updateEscrowStatus(projectId: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(escrow).set({ status: status as any }).where(eq(escrow.projectId, projectId));
}

// Disputes
export async function getDisputeByProjectId(projectId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(disputes).where(eq(disputes.projectId, projectId)).limit(1);
  return result[0];
}

export async function createDispute(data: InsertDispute) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(disputes).values(data);
}

// Transactions
export async function getTransactionsByProjectId(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(transactions).where(eq(transactions.projectId, projectId));
}

export async function createTransaction(data: InsertTransaction) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(transactions).values(data);
}

// Milestones
export async function getMilestonesByProjectId(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(milestones).where(eq(milestones.projectId, projectId));
}

export async function createMilestone(data: InsertMilestone) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(milestones).values(data);
}

// Messages
export async function getMessagesByProjectId(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(messages).where(eq(messages.projectId, projectId));
}

export async function createMessage(data: InsertMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(messages).values(data);
}

// User queries
export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0];
}
