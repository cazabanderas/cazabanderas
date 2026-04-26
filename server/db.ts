import { eq, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, teamMembers, teamCredentials, activityLog, teamResources, InsertTeamResource, huntersProfiles, platforms, achievements, InsertPlatform, InsertAchievement, teamWriteups, InsertTeamWriteup, recruitmentApplications } from "../drizzle/schema";
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

/**
 * Get all hunters profiles for the public website
 */
export async function getHuntersProfiles() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get hunters profiles: database not available");
    return [];
  }

  try {
    const { huntersProfiles } = await import("../drizzle/schema");
    const results = await db
      .select()
      .from(huntersProfiles)
      .where(eq(huntersProfiles.isVisible, 1))
      .orderBy(huntersProfiles.ranking);
    return results;
  } catch (error) {
    console.error("[Database] Failed to get hunters profiles:", error);
    return [];
  }
}

/**
 * Get all hunters profiles for admin (including hidden ones)
 */
export async function getAllHuntersProfiles() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get hunters profiles: database not available");
    return [];
  }

  try {
    const { huntersProfiles } = await import("../drizzle/schema");
    const results = await db
      .select()
      .from(huntersProfiles)
      .orderBy(huntersProfiles.ranking);
    return results;
  } catch (error) {
    console.error("[Database] Failed to get hunters profiles:", error);
    return [];
  }
}

/**
 * Create or update a hunters profile
 */
export async function upsertHuntersProfile(profile: any) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert hunters profile: database not available");
    return null;
  }

  try {
    const { huntersProfiles } = await import("../drizzle/schema");
    
    if (profile.id) {
      // Update existing
      await db
        .update(huntersProfiles)
        .set(profile)
        .where(eq(huntersProfiles.id, profile.id));
      return profile;
    } else {
      // Create new
      const result = await db.insert(huntersProfiles).values(profile);
      return { ...profile, id: result[0] };
    }
  } catch (error) {
    console.error("[Database] Failed to upsert hunters profile:", error);
    throw error;
  }
}

/**
 * Delete a hunters profile
 */
export async function deleteHuntersProfile(profileId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete hunters profile: database not available");
    return;
  }

  try {
    const { huntersProfiles } = await import("../drizzle/schema");
    await db.delete(huntersProfiles).where(eq(huntersProfiles.id, profileId));
  } catch (error) {
    console.error("[Database] Failed to delete hunters profile:", error);
    throw error;
  }
}


/**
 * Get all platforms for the website
 */
export async function getPlatforms() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get platforms: database not available");
    return [];
  }

  try {
    const results = await db
      .select()
      .from(platforms)
      .where(eq(platforms.isVisible, 1))
      .orderBy(platforms.displayOrder);
    return results;
  } catch (error) {
    console.error("[Database] Failed to get platforms:", error);
    return [];
  }
}

/**
 * Get all platforms for admin (including hidden ones)
 */
export async function getAllPlatforms() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get platforms: database not available");
    return [];
  }

  try {
    const results = await db
      .select()
      .from(platforms)
      .orderBy(platforms.displayOrder);
    return results;
  } catch (error) {
    console.error("[Database] Failed to get platforms:", error);
    return [];
  }
}

/**
 * Create or update a platform
 */
export async function upsertPlatform(platform: any) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert platform: database not available");
    return null;
  }

  try {
    if (platform.id) {
      await db
        .update(platforms)
        .set(platform)
        .where(eq(platforms.id, platform.id));
      return platform;
    } else {
      const result = await db.insert(platforms).values(platform);
      return { ...platform, id: result[0] };
    }
  } catch (error) {
    console.error("[Database] Failed to upsert platform:", error);
    throw error;
  }
}

/**
 * Delete a platform
 */
export async function deletePlatform(platformId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete platform: database not available");
    return;
  }

  try {
    await db.delete(platforms).where(eq(platforms.id, platformId));
  } catch (error) {
    console.error("[Database] Failed to delete platform:", error);
    throw error;
  }
}

/**
 * Get all achievements
 */
export async function getAchievements() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get achievements: database not available");
    return [];
  }

  try {
    const results = await db
      .select()
      .from(achievements)
      .where(eq(achievements.isVisible, 1))
      .orderBy(achievements.displayOrder);
    return results;
  } catch (error) {
    console.error("[Database] Failed to get achievements:", error);
    return [];
  }
}

/**
 * Get all achievements for admin (including hidden ones)
 */
export async function getAllAchievements() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get achievements: database not available");
    return [];
  }

  try {
    const results = await db
      .select()
      .from(achievements)
      .orderBy(achievements.displayOrder);
    return results;
  } catch (error) {
    console.error("[Database] Failed to get achievements:", error);
    return [];
  }
}

/**
 * Create or update an achievement
 */
export async function upsertAchievement(achievement: any) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert achievement: database not available");
    return null;
  }

  try {
    if (achievement.id) {
      await db
        .update(achievements)
        .set(achievement)
        .where(eq(achievements.id, achievement.id));
      return achievement;
    } else {
      const result = await db.insert(achievements).values(achievement);
      return { ...achievement, id: result[0] };
    }
  } catch (error) {
    console.error("[Database] Failed to upsert achievement:", error);
    throw error;
  }
}

/**
 * Delete an achievement
 */
export async function deleteAchievement(achievementId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete achievement: database not available");
    return;
  }

  try {
    await db.delete(achievements).where(eq(achievements.id, achievementId));
  } catch (error) {
    console.error("[Database] Failed to delete achievement:", error);
    throw error;
  }
}


/**
 * Get all public write-ups (for homepage display)
 */
export async function getPublicWriteups() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get write-ups: database not available");
    return [];
  }

  try {
    const results = await db
      .select()
      .from(teamWriteups)
      .leftJoin(teamMembers, eq(teamWriteups.teamMemberId, teamMembers.id))
      .where(eq(teamWriteups.isPublic, 1))
      .orderBy(desc(teamWriteups.createdAt));
    
    return results.map(row => ({
      ...row.teamWriteups,
      teamMember: row.teamMembers ? {
        id: row.teamMembers.id,
        displayName: row.teamMembers.displayName,
        specialty: row.teamMembers.specialty,
      } : null,
    }));
  } catch (error) {
    console.error("[Database] Failed to get public write-ups:", error);
    return [];
  }
}

/**
 * Get all write-ups for a team member (public and private)
 */
export async function getTeamMemberWriteups(teamMemberId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get write-ups: database not available");
    return [];
  }

  try {
    const results = await db
      .select()
      .from(teamWriteups)
      .where(eq(teamWriteups.teamMemberId, teamMemberId))
      .orderBy(desc(teamWriteups.createdAt));
    return results;
  } catch (error) {
    console.error("[Database] Failed to get team member write-ups:", error);
    return [];
  }
}

/**
 * Get all write-ups for team (for team dashboard)
 */
export async function getAllTeamWriteups() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get write-ups: database not available");
    return [];
  }

  try {
    const results = await db
      .select()
      .from(teamWriteups)
      .orderBy(desc(teamWriteups.createdAt));
    return results;
  } catch (error) {
    console.error("[Database] Failed to get all team write-ups:", error);
    return [];
  }
}

/**
 * Get a single write-up by ID
 */
export async function getWriteupById(writeupId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get write-up: database not available");
    return null;
  }

  try {
    const results = await db
      .select()
      .from(teamWriteups)
      .where(eq(teamWriteups.id, writeupId))
      .limit(1);
    return results[0] || null;
  } catch (error) {
    console.error("[Database] Failed to get write-up:", error);
    return null;
  }
}

/**
 * Create a new write-up
 */
export async function createWriteup(data: InsertTeamWriteup) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create write-up: database not available");
    return null;
  }

  try {
    const result = await db.insert(teamWriteups).values(data);
    return { ...data, id: result[0].insertId };
  } catch (error) {
    console.error("[Database] Failed to create write-up:", error);
    throw error;
  }
}

/**
 * Update a write-up
 */
export async function updateWriteup(writeupId: number, data: Partial<InsertTeamWriteup>) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update write-up: database not available");
    return null;
  }

  try {
    await db
      .update(teamWriteups)
      .set(data)
      .where(eq(teamWriteups.id, writeupId));
    return { id: writeupId, ...data };
  } catch (error) {
    console.error("[Database] Failed to update write-up:", error);
    throw error;
  }
}

/**
 * Delete a write-up
 */
export async function deleteWriteup(writeupId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete write-up: database not available");
    return;
  }

  try {
    await db.delete(teamWriteups).where(eq(teamWriteups.id, writeupId));
  } catch (error) {
    console.error("[Database] Failed to delete write-up:", error);
    throw error;
  }
}

/**
 * Toggle write-up visibility (public/private)
 */
export async function toggleWriteupVisibility(writeupId: number, isPublic: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot toggle visibility: database not available");
    return null;
  }

  try {
    await db
      .update(teamWriteups)
      .set({ isPublic })
      .where(eq(teamWriteups.id, writeupId));
    return { id: writeupId, isPublic };
  } catch (error) {
    console.error("[Database] Failed to toggle write-up visibility:", error);
    throw error;
  }
}

/**
 * Increment write-up view count
 */
export async function incrementWriteupViews(writeupId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot increment views: database not available");
    return;
  }

  try {
    await db
      .update(teamWriteups)
      .set({ viewCount: sql`${teamWriteups.viewCount} + 1` })
      .where(eq(teamWriteups.id, writeupId));
  } catch (error) {
    console.error("[Database] Failed to increment write-up views:", error);
  }
}


/**
 * Submit a new recruitment application
 */
export async function submitRecruitmentApplication(data: {
  discordUsername: string;
  htbProfile?: string;
  thmProfile?: string;
  hcProfile?: string;
  githubProfile?: string;
  blogUrl?: string;
  motivation: string;
  mainSpecialty: string;
  yearsOfExperience: string;
  biggestChallenge?: string;
  categoriesToImprove?: string;
  weeklyCommitment: string;
  idealTeamDynamic?: string;
  automatedScore: number;
}) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot submit application: database not available");
    return null;
  }

  try {
    const result = await db.insert(recruitmentApplications).values({
      ...data,
      status: "pending",
    });
    return result;
  } catch (error) {
    console.error("[Database] Failed to submit application:", error);
    throw error;
  }
}

/**
 * Get all recruitment applications with optional filtering
 */
export async function getRecruitmentApplications(filters?: {
  status?: "pending" | "reviewed" | "accepted" | "rejected";
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get applications: database not available");
    return [];
  }

  try {
    let query: any = db.select().from(recruitmentApplications);

    if (filters?.status) {
      query = query.where(eq(recruitmentApplications.status, filters.status as any));
    }

    const limit = filters?.limit || 100;
    const offset = filters?.offset || 0;

    return await query
      .orderBy(desc(recruitmentApplications.automatedScore), desc(recruitmentApplications.createdAt))
      .limit(limit)
      .offset(offset);
  } catch (error) {
    console.error("[Database] Failed to get applications:", error);
    return [];
  }
}

/**
 * Get a single recruitment application by ID
 */
export async function getRecruitmentApplicationById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get application: database not available");
    return null;
  }

  try {
    const result = await db
      .select()
      .from(recruitmentApplications)
      .where(eq(recruitmentApplications.id, id))
      .limit(1);

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to get application:", error);
    return null;
  }
}

/**
 * Update recruitment application status and add review notes
 */
export async function updateRecruitmentApplicationStatus(
  id: number,
  status: "pending" | "reviewed" | "accepted" | "rejected",
  reviewNotes?: string,
  feedbackMessage?: string
) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update application: database not available");
    return null;
  }

  try {
    const updateData: any = {
      status,
      reviewedAt: new Date(),
    };

    if (reviewNotes !== undefined) {
      updateData.reviewNotes = reviewNotes;
    }

    if (feedbackMessage !== undefined) {
      updateData.feedbackMessage = feedbackMessage;
    }

    if (status === "accepted" || status === "rejected") {
      updateData.decidedAt = new Date();
    }

    await db
      .update(recruitmentApplications)
      .set(updateData)
      .where(eq(recruitmentApplications.id, id));

    return { id, status, reviewedAt: new Date() };
  } catch (error) {
    console.error("[Database] Failed to update application:", error);
    throw error;
  }
}



/**
 * Get full leaderboard with all member stats, ordered by rank
 */
export async function getLeaderboard() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get leaderboard: database not available");
    return [];
  }

  try {
    const { leaderboardStats, htbTeamMembers } = await import("../drizzle/schema");
    const { eq } = await import("drizzle-orm");

    const stats = await db
      .select({
        id: leaderboardStats.id,
        htbTeamMemberId: leaderboardStats.htbTeamMemberId,
        totalFlags: leaderboardStats.totalFlags,
        totalChallenges: leaderboardStats.totalChallenges,
        totalPoints: leaderboardStats.totalPoints,
        rankPosition: leaderboardStats.rankPosition,
        tier: leaderboardStats.tier,
        previousRankPosition: leaderboardStats.previousRankPosition,
        lastUpdated: leaderboardStats.lastUpdated,
        memberName: htbTeamMembers.displayName,
        memberUsername: htbTeamMembers.htbUsername,
        memberAvatar: htbTeamMembers.profilePictureUrl,
        memberTitle: htbTeamMembers.title,
        memberSpecialties: htbTeamMembers.specialties,
        memberVisible: htbTeamMembers.isVisible,
      })
      .from(leaderboardStats)
      .innerJoin(htbTeamMembers, eq(leaderboardStats.htbTeamMemberId, htbTeamMembers.id))
      .orderBy(leaderboardStats.rankPosition);

    return stats;
  } catch (error) {
    console.error("[Database] Failed to get leaderboard:", error);
    return [];
  }
}

/**
 * Get leaderboard stats for a specific member
 */
export async function getMemberLeaderboardStats(htbTeamMemberId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get member stats: database not available");
    return null;
  }

  try {
    const { leaderboardStats } = await import("../drizzle/schema");
    const { eq } = await import("drizzle-orm");

    const stats = await db
      .select()
      .from(leaderboardStats)
      .where(eq(leaderboardStats.htbTeamMemberId, htbTeamMemberId))
      .limit(1);

    return stats[0] || null;
  } catch (error) {
    console.error("[Database] Failed to get member stats:", error);
    return null;
  }
}

/**
 * Update or create leaderboard stats for a member
 */
export async function upsertLeaderboardStats(
  htbTeamMemberId: number,
  data: {
    totalFlags: number;
    totalChallenges: number;
    totalPoints: number;
    rankPosition?: number;
    tier?: string;
    previousRankPosition?: number;
  }
) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert leaderboard stats: database not available");
    return null;
  }

  try {
    const { leaderboardStats } = await import("../drizzle/schema");
    const { eq } = await import("drizzle-orm");

    // Check if stats exist
    const existing = await db
      .select()
      .from(leaderboardStats)
      .where(eq(leaderboardStats.htbTeamMemberId, htbTeamMemberId))
      .limit(1);

    if (existing.length > 0) {
      // Update existing
      await db
        .update(leaderboardStats)
        .set({
          totalFlags: data.totalFlags,
          totalChallenges: data.totalChallenges,
          totalPoints: data.totalPoints,
          rankPosition: data.rankPosition,
          tier: data.tier || "bronze",
          previousRankPosition: data.previousRankPosition,
          lastUpdated: new Date(),
        })
        .where(eq(leaderboardStats.htbTeamMemberId, htbTeamMemberId));
    } else {
      // Create new
      await db.insert(leaderboardStats).values({
        htbTeamMemberId,
        totalFlags: data.totalFlags,
        totalChallenges: data.totalChallenges,
        totalPoints: data.totalPoints,
        rankPosition: data.rankPosition,
        tier: data.tier || "bronze",
        previousRankPosition: data.previousRankPosition,
        lastUpdated: new Date(),
      });
    }

    return await getMemberLeaderboardStats(htbTeamMemberId);
  } catch (error) {
    console.error("[Database] Failed to upsert leaderboard stats:", error);
    return null;
  }
}

/**
 * Recalculate all leaderboard rankings based on current data
 * Should be called whenever member stats change
 */
export async function recalculateLeaderboard() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot recalculate leaderboard: database not available");
    return [];
  }

  try {
    const { leaderboardStats } = await import("../drizzle/schema");
    const { desc, eq } = await import("drizzle-orm");

    // Get all stats ordered by points
    const allStats = await db
      .select()
      .from(leaderboardStats)
      .orderBy(desc(leaderboardStats.totalPoints));

    // Update rank positions
    for (let i = 0; i < allStats.length; i++) {
      const stat = allStats[i];
      const newRank = i + 1;
      const tier = getTierFromPoints(stat.totalPoints);

      const { eq } = await import("drizzle-orm");
      await db
        .update(leaderboardStats)
        .set({
          rankPosition: newRank,
          previousRankPosition: stat.rankPosition,
          tier,
          lastUpdated: new Date(),
        })
        .where(eq(leaderboardStats.id, stat.id));
    }

    return getLeaderboard();
  } catch (error) {
    console.error("[Database] Failed to recalculate leaderboard:", error);
    return [];
  }
}

/**
 * Determine tier based on total points
 */
function getTierFromPoints(points: number): string {
  if (points >= 5000) return "platinum";
  if (points >= 3000) return "gold";
  if (points >= 1000) return "silver";
  return "bronze";
}
