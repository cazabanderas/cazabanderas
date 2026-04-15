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
