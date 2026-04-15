import { eq, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, teamMembers, teamCredentials, activityLog, teamResources, InsertTeamResource } from "../drizzle/schema";
import { ENV } from './_core/env';
import bcrypt from 'bcryptjs';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
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

/**
 * Check if a user is an official team member
 * Only team members with isApproved=1 can access the site
 */
export async function isTeamMember(openId: string): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot check team member: database not available");
    return false;
  }

  try {
    const result = await db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.openId, openId))
      .limit(1);

    return result.length > 0 && result[0].isApproved === 1;
  } catch (error) {
    console.error("[Database] Failed to check team member:", error);
    return false;
  }
}

/**
 * Get all approved team members
 */
export async function getAllTeamMembers() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get team members: database not available");
    return [];
  }

  try {
    const result = await db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.isApproved, 1));

    return result;
  } catch (error) {
    console.error("[Database] Failed to get team members:", error);
    return [];
  }
}

/**
 * Authenticate team member with username and password
 * Returns team member info if credentials are valid
 */
export async function authenticateTeamMember(username: string, password: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot authenticate: database not available");
    return null;
  }

  try {
    const credential = await db
      .select()
      .from(teamCredentials)
      .where(eq(teamCredentials.username, username))
      .limit(1);

    if (credential.length === 0 || credential[0].isActive !== 1) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, credential[0].passwordHash);
    if (!isPasswordValid) {
      return null;
    }

    const member = await db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.id, credential[0].teamMemberId))
      .limit(1);

    if (member.length === 0 || member[0].isApproved !== 1) {
      return null;
    }

    return member[0];
  } catch (error) {
    console.error("[Database] Failed to authenticate team member:", error);
    return null;
  }
}

/**
 * Hash a password for storage
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Create team credentials for a team member
 */
export async function createTeamCredentials(
  teamMemberId: number,
  username: string,
  password: string
) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create credentials: database not available");
    return null;
  }

  try {
    const passwordHash = await hashPassword(password);
    await db.insert(teamCredentials).values({
      teamMemberId,
      username,
      passwordHash,
      isActive: 1,
    });
    return { username, teamMemberId };
  } catch (error) {
    console.error("[Database] Failed to create team credentials:", error);
    return null;
  }
}

/**
 * Log an activity/event for security auditing
 */
export async function logActivity({
  teamMemberId,
  action,
  details,
  ipAddress,
  userAgent,
  success = 1,
}: {
  teamMemberId: number;
  action: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  success?: number;
}): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Activity Log] Cannot log activity: database not available");
    return;
  }

  try {
    await db.insert(activityLog).values({
      teamMemberId,
      action,
      details: details || null,
      ipAddress: ipAddress || null,
      userAgent: userAgent || null,
      success,
    });
  } catch (error) {
    console.error("[Activity Log] Failed to log activity:", error);
  }
}

/**
 * Get activity log entries with optional filtering
 */
export async function getActivityLog({
  teamMemberId,
  action,
  limit = 100,
  offset = 0,
}: {
  teamMemberId?: number;
  action?: string;
  limit?: number;
  offset?: number;
} = {}) {
  const db = await getDb();
  if (!db) {
    console.warn("[Activity Log] Cannot fetch activity log: database not available");
    return [];
  }

  try {
    let query: any = db.select().from(activityLog);

    if (teamMemberId !== undefined) {
      query = query.where(eq(activityLog.teamMemberId, teamMemberId));
    }
    if (action !== undefined) {
      query = query.where(eq(activityLog.action, action));
    }

    const results = await query
      .orderBy(desc(activityLog.timestamp))
      .limit(limit)
      .offset(offset);

    return results;
  } catch (error) {
    console.error("[Activity Log] Failed to fetch activity log:", error);
    return [];
  }
}


/**
 * Get all team resources with optional filtering
 */
export async function getTeamResources(filters?: {
  category?: string;
  uploadedBy?: number;
}) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get team resources: database not available");
    return [];
  }

  try {
    let query: any = db.select().from(teamResources);

    if (filters?.category) {
      query = query.where(eq(teamResources.category, filters.category));
    }
    if (filters?.uploadedBy) {
      query = query.where(eq(teamResources.uploadedBy, filters.uploadedBy));
    }

    return await query.orderBy(desc(teamResources.createdAt));
  } catch (error) {
    console.error("[Database] Failed to get team resources:", error);
    return [];
  }
}

/**
 * Create a new team resource
 */
export async function createTeamResource(resource: InsertTeamResource) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create team resource: database not available");
    return null;
  }

  try {
    const result = await db.insert(teamResources).values(resource);
    return result;
  } catch (error) {
    console.error("[Database] Failed to create team resource:", error);
    throw error;
  }
}

/**
 * Increment download count for a resource
 */
export async function incrementDownloadCount(resourceId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot increment download count: database not available");
    return;
  }

  try {
    await db
      .update(teamResources)
      .set({ downloadCount: sql`${teamResources.downloadCount} + 1` })
      .where(eq(teamResources.id, resourceId));
  } catch (error) {
    console.error("[Database] Failed to increment download count:", error);
  }
}

/**
 * Delete a team resource
 */
export async function deleteTeamResource(resourceId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete team resource: database not available");
    return;
  }

  try {
    await db.delete(teamResources).where(eq(teamResources.id, resourceId));
  } catch (error) {
    console.error("[Database] Failed to delete team resource:", error);
    throw error;
  }
}
