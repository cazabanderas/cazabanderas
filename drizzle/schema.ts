import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

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
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Team members table - stores official Cazabanderas team members
 * Only users whose openId matches an entry in this table can access the site
 */
export const teamMembers = mysqlTable("teamMembers", {
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier - must match users.openId for access */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  /** Display name for the team member */
  displayName: text("displayName").notNull(),
  /** Team member's specialty/role (e.g., Web Exploitation, Reverse Engineering) */
  specialty: varchar("specialty", { length: 255 }),
  /** HTB profile URL */
  htbProfile: text("htbProfile"),
  /** TryHackMe profile URL */
  thmProfile: text("thmProfile"),
  /** Whether this member is approved to access the site */
  isApproved: int("isApproved").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = typeof teamMembers.$inferInsert;

/**
 * Team credentials table - stores custom login credentials for team members
 * Username and password hash for custom authentication (no OAuth)
 */
export const teamCredentials = mysqlTable("teamCredentials", {
  id: int("id").autoincrement().primaryKey(),
  /** Unique username for login */
  username: varchar("username", { length: 255 }).notNull().unique(),
  /** Hashed password (bcrypt) */
  passwordHash: text("passwordHash").notNull(),
  /** Reference to team member */
  teamMemberId: int("teamMemberId").notNull(),
  /** Whether this credential is active */
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TeamCredential = typeof teamCredentials.$inferSelect;
export type InsertTeamCredential = typeof teamCredentials.$inferInsert;
/**
 * Activity log table - tracks all security-relevant events
 * Login attempts, credential changes, member deletions, etc.
 */
export const activityLog = mysqlTable("activityLog", {
  id: int("id").autoincrement().primaryKey(),
  /** Reference to team member performing or affected by the action */
  teamMemberId: int("teamMemberId").notNull(),
  /** Action type: login, login_failed, credential_created, credential_reset, credential_deactivated, member_deleted, member_added */
  action: varchar("action", { length: 50 }).notNull(),
  /** Detailed description of the action */
  details: text("details"),
  /** IP address of the request (if applicable) */
  ipAddress: varchar("ipAddress", { length: 45 }),
  /** User agent / browser info */
  userAgent: text("userAgent"),
  /** 1 = success, 0 = failure */
  success: int("success").default(1).notNull(),
  /** When the action occurred */
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ActivityLog = typeof activityLog.$inferSelect;
export type InsertActivityLog = typeof activityLog.$inferInsert;

/**
 * Team Resources table - stores shared files, documentation, and tools
 * Accessible only to team members with download tracking
 */
export const teamResources = mysqlTable("teamResources", {
  id: int("id").autoincrement().primaryKey(),
  /** Resource title */
  title: varchar("title", { length: 255 }).notNull(),
  /** Detailed description */
  description: text("description"),
  /** Category: Documentation, Tools, Guides, Scripts, Exploits, etc. */
  category: varchar("category", { length: 100 }).notNull(),
  /** S3 file URL */
  fileUrl: text("fileUrl").notNull(),
  /** S3 file key for deletion */
  fileKey: text("fileKey").notNull(),
  /** Original file name */
  fileName: varchar("fileName", { length: 255 }).notNull(),
  /** File size in bytes */
  fileSize: int("fileSize"),
  /** MIME type */
  mimeType: varchar("mimeType", { length: 100 }),
  /** Team member who uploaded */
  uploadedBy: int("uploadedBy").notNull(),
  /** Download count */
  downloadCount: int("downloadCount").default(0).notNull(),
  /** 0 = team only, 1 = public */
  isPublic: int("isPublic").default(0).notNull(),
  /** Comma-separated tags for filtering */
  tags: varchar("tags", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TeamResource = typeof teamResources.$inferSelect;
export type InsertTeamResource = typeof teamResources.$inferInsert;

/**
 * Hunters Profile table - stores public team member profiles for the "Meet the hunters" section
 * Separate from teamMembers to allow different visibility and display settings
 */
export const huntersProfiles = mysqlTable("huntersProfiles", {
  id: int("id").autoincrement().primaryKey(),
  /** Reference to team member */
  teamMemberId: int("teamMemberId").notNull(),
  /** Display name (can differ from login name) */
  displayName: varchar("displayName", { length: 255 }).notNull(),
  /** Hunter's title/role (e.g., "Web Exploitation Specialist", "Reverse Engineer") */
  title: varchar("title", { length: 255 }),
  /** Short bio or catchphrase */
  bio: text("bio"),
  /** Primary specialty */
  specialty: varchar("specialty", { length: 100 }),
  /** Profile image URL (avatar) */
  avatarUrl: text("avatarUrl"),
  /** HTB profile URL */
  htbProfile: text("htbProfile"),
  /** TryHackMe profile URL */
  thmProfile: text("thmProfile"),
  /** GitHub profile URL */
  githubProfile: text("githubProfile"),
  /** Twitter/X profile URL */
  twitterProfile: text("twitterProfile"),
  /** Number of flags captured */
  flagsCount: int("flagsCount").default(0).notNull(),
  /** Ranking/position in team */
  ranking: int("ranking"),
  /** Whether this profile is visible on the public website */
  isVisible: int("isVisible").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type HuntersProfile = typeof huntersProfiles.$inferSelect;
export type InsertHuntersProfile = typeof huntersProfiles.$inferInsert;

/**
 * Platforms table - stores CTF platforms where the team competes
 * Used in "Where we compete" section on the homepage
 */
export const platforms = mysqlTable("platforms", {
  id: int("id").autoincrement().primaryKey(),
  /** Platform name (e.g., HackTheBox, TryHackMe) */
  name: varchar("name", { length: 255 }).notNull(),
  /** Short abbreviation (e.g., HTB, THM) */
  abbreviation: varchar("abbreviation", { length: 50 }).notNull(),
  /** Team's ranking or achievement on this platform */
  ranking: text("ranking").notNull(),
  /** Description of the platform and team's involvement */
  description: text("description"),
  /** Tags/categories (e.g., ACTIVE MEMBERS, CHALLENGES, etc.) */
  tags: varchar("tags", { length: 500 }),
  /** Display order */
  displayOrder: int("displayOrder").default(0).notNull(),
  /** Whether this platform is visible on the website */
  isVisible: int("isVisible").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Platform = typeof platforms.$inferSelect;
export type InsertPlatform = typeof platforms.$inferInsert;

/**
 * Achievements table - stores team statistics and achievements
 * Used in "Flags captured" and other achievement sections
 */
export const achievements = mysqlTable("achievements", {
  id: int("id").autoincrement().primaryKey(),
  /** Achievement key/identifier (e.g., flags_captured, ctfs_completed, active_members) */
  key: varchar("key", { length: 100 }).notNull().unique(),
  /** Display label (e.g., "Flags Captured") */
  label: varchar("label", { length: 255 }).notNull(),
  /** Current value/count */
  value: varchar("value", { length: 255 }).notNull(),
  /** Description or context */
  description: text("description"),
  /** Icon or emoji representation */
  icon: varchar("icon", { length: 50 }),
  /** Display order */
  displayOrder: int("displayOrder").default(0).notNull(),
  /** Whether this achievement is visible on the website */
  isVisible: int("isVisible").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = typeof achievements.$inferInsert;


/**
 * Team Write-ups table - stores write-ups created by team members
 * Can be public (displayed on homepage) or private (team-only)
 */
export const teamWriteups = mysqlTable("teamWriteups", {
  id: int("id").autoincrement().primaryKey(),
  /** Team member who created this write-up */
  teamMemberId: int("teamMemberId").notNull().references(() => teamMembers.id, { onDelete: "cascade" }),
  /** Write-up title */
  title: varchar("title", { length: 255 }).notNull(),
  /** Write-up content (markdown format) */
  content: text("content").notNull(),
  /** Challenge/CTF name */
  challengeName: varchar("challengeName", { length: 255 }),
  /** CTF platform (e.g., HackTheBox, TryHackMe, CTFtime) */
  platform: varchar("platform", { length: 100 }),
  /** Difficulty level (e.g., Easy, Medium, Hard, Insane) */
  difficulty: varchar("difficulty", { length: 50 }),
  /** Category/tags (comma-separated) */
  category: varchar("category", { length: 255 }),
  /** Whether this write-up is public (visible on homepage) */
  isPublic: int("isPublic").default(0).notNull(),
  /** View count */
  viewCount: int("viewCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TeamWriteup = typeof teamWriteups.$inferSelect;
export type InsertTeamWriteup = typeof teamWriteups.$inferInsert;


/**
 * Recruitment Applications table - stores applications from potential team members
 * Tracks application status, automated scoring, and review notes
 */
export const recruitmentApplications = mysqlTable("recruitmentApplications", {
  id: int("id").autoincrement().primaryKey(),
  /** Discord username of applicant */
  discordUsername: varchar("discordUsername", { length: 255 }).notNull(),
  /** HTB profile URL */
  htbProfile: text("htbProfile"),
  /** TryHackMe profile URL */
  thmProfile: text("thmProfile"),
  /** HackingClub profile URL */
  hcProfile: text("hcProfile"),
  /** GitHub profile URL */
  githubProfile: text("githubProfile"),
  /** Personal blog/website URL */
  blogUrl: text("blogUrl"),
  /** Why do you want to join? */
  motivation: text("motivation").notNull(),
  /** Main CTF specialty */
  mainSpecialty: varchar("mainSpecialty", { length: 255 }).notNull(),
  /** Years of experience */
  yearsOfExperience: varchar("yearsOfExperience", { length: 50 }).notNull(),
  /** Biggest CTF challenge/failure and what they learned */
  biggestChallenge: text("biggestChallenge"),
  /** CTF categories they want to improve in (comma-separated) */
  categoriesToImprove: varchar("categoriesToImprove", { length: 500 }),
  /** Hours per week they can commit */
  weeklyCommitment: varchar("weeklyCommitment", { length: 50 }).notNull(),
  /** Ideal team dynamic description */
  idealTeamDynamic: text("idealTeamDynamic"),
  /** Automated score (0-100) */
  automatedScore: int("automatedScore").default(0).notNull(),
  /** Application status: pending, reviewed, accepted, rejected */
  status: mysqlEnum("status", ["pending", "reviewed", "accepted", "rejected"]).default("pending").notNull(),
  /** Admin review notes */
  reviewNotes: text("reviewNotes"),
  /** Feedback sent to applicant */
  feedbackMessage: text("feedbackMessage"),
  /** When the application was reviewed */
  reviewedAt: timestamp("reviewedAt"),
  /** When the decision was made */
  decidedAt: timestamp("decidedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type RecruitmentApplication = typeof recruitmentApplications.$inferSelect;
export type InsertRecruitmentApplication = typeof recruitmentApplications.$inferInsert;


/**
 * Completed Challenges table - stores all challenges completed by the team
 * Used for deduplication: prevents counting the same challenge twice when multiple team members complete it
 * Tracks challenge name, category, and when it was first logged
 */
export const completedChallenges = mysqlTable("completedChallenges", {
  id: int("id").autoincrement().primaryKey(),
  /** Challenge name (e.g., "Low Logic", "The Puppet Master") */
  challengeName: varchar("challengeName", { length: 255 }).notNull().unique(),
  /** Challenge category (OSINT, Web, Reversing, etc.) */
  category: varchar("category", { length: 100 }).notNull(),
  /** HTB challenge ID (if available) */
  htbChallengeId: varchar("htbChallengeId", { length: 100 }),
  /** Difficulty level (Easy, Medium, Hard, Insane) */
  difficulty: varchar("difficulty", { length: 50 }),
  /** Points awarded for this challenge */
  points: int("points").default(0).notNull(),
  /** When this challenge was first completed and logged */
  completedAt: timestamp("completedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CompletedChallenge = typeof completedChallenges.$inferSelect;
export type InsertCompletedChallenge = typeof completedChallenges.$inferInsert;


/**
 * HTB Team Members table - stores team members synced from HackTheBox API
 * Synced from HTB team activity to display on "Nuestro Manada" section
 * Includes profile picture and name, with ability to edit in admin panel
 */
export const htbTeamMembers = mysqlTable("htbTeamMembers", {
  id: int("id").autoincrement().primaryKey(),
  /** HTB user ID */
  htbUserId: int("htbUserId").notNull().unique(),
  /** HTB username */
  htbUsername: varchar("htbUsername", { length: 255 }).notNull(),
  /** Display name (can be edited in admin panel) */
  displayName: varchar("displayName", { length: 255 }).notNull(),
  /** Profile picture URL from HTB */
  profilePictureUrl: text("profilePictureUrl"),
  /** Whether this member is displayed on the website */
  isVisible: int("isVisible").default(1).notNull(),
  /** Custom notes/bio (editable in admin panel) */
  notes: text("notes"),
  /** Job title or role (editable in admin panel) */
  title: varchar("title", { length: 255 }),
  /** Bio/description (editable in admin panel) */
  bio: text("bio"),
  /** Specialties/skills (editable in admin panel, comma-separated) */
  specialties: text("specialties"),
  /** HackTheBox profile URL (editable in admin panel) */
  htbUrl: text("htbUrl"),
  /** TryHackMe profile URL (editable in admin panel) */
  thmUrl: text("thmUrl"),
  /** GitHub profile URL (editable in admin panel) */
  githubUrl: text("githubUrl"),
  /** LinkedIn profile URL (editable in admin panel) */
  linkedinUrl: text("linkedinUrl"),
  /** Personal blog URL (editable in admin panel) */
  blogUrl: text("blogUrl"),
  /** When this member was first synced from HTB */
  syncedAt: timestamp("syncedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type HTBTeamMember = typeof htbTeamMembers.$inferSelect;
export type InsertHTBTeamMember = typeof htbTeamMembers.$inferInsert;

/**
 * Leaderboard Stats table - stores computed leaderboard rankings and statistics
 * Aggregates flags, challenges, and points for each team member
 * Updated whenever challenges are completed or member profiles are updated
 */
export const leaderboardStats = mysqlTable("leaderboardStats", {
  id: int("id").autoincrement().primaryKey(),
  /** Reference to HTB team member */
  htbTeamMemberId: int("htbTeamMemberId").notNull().unique().references(() => htbTeamMembers.id, { onDelete: "cascade" }),
  /** Total flags captured by this member */
  totalFlags: int("totalFlags").default(0).notNull(),
  /** Total unique challenges solved */
  totalChallenges: int("totalChallenges").default(0).notNull(),
  /** Total points earned */
  totalPoints: int("totalPoints").default(0).notNull(),
  /** Current rank position (1st, 2nd, etc.) */
  rankPosition: int("rankPosition"),
  /** Tier based on total points (bronze/silver/gold/platinum) */
  tier: varchar("tier", { length: 50 }).default("bronze").notNull(),
  /** Previous rank position for trending */
  previousRankPosition: int("previousRankPosition"),
  /** When stats were last updated */
  lastUpdated: timestamp("lastUpdated").defaultNow().onUpdateNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LeaderboardStats = typeof leaderboardStats.$inferSelect;
export type InsertLeaderboardStats = typeof leaderboardStats.$inferInsert;
