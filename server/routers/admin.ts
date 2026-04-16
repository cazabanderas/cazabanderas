import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { 
  getAllTeamMembers, 
  createTeamCredentials, 
  hashPassword,
  getDb,
  authenticateTeamMember,
  logActivity,
  getActivityLog,
  getAllHuntersProfiles,
  upsertHuntersProfile,
  deleteHuntersProfile,
  getAllPlatforms,
  upsertPlatform,
  deletePlatform,
  getAllAchievements,
  upsertAchievement,
  deleteAchievement
} from "../db";
import { TRPCError } from "@trpc/server";
import { teamMembers, teamCredentials, huntersProfiles, platforms, achievements } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const adminRouter = router({
  /**
   * Get all team members with their credentials
   */
  listMembers: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database unavailable",
      });
    }

    try {
      const members = await db
        .select({
          id: teamMembers.id,
          displayName: teamMembers.displayName,
          specialty: teamMembers.specialty,
          openId: teamMembers.openId,
          isApproved: teamMembers.isApproved,
          createdAt: teamMembers.createdAt,
        })
        .from(teamMembers);

      // Get credentials for each member
      const membersWithCreds = await Promise.all(
        members.map(async (member) => {
          const creds = await db
            .select({
              id: teamCredentials.id,
              username: teamCredentials.username,
              isActive: teamCredentials.isActive,
            })
            .from(teamCredentials)
            .where(eq(teamCredentials.teamMemberId, member.id));

          return {
            ...member,
            credentials: creds,
          };
        })
      );

      return membersWithCreds;
    } catch (error) {
      console.error("[Admin] Failed to list members:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch team members",
      });
    }
  }),

  /**
   * Add a new team member with credentials
   */
  addMember: publicProcedure
    .input(
      z.object({
        displayName: z.string().min(1, "Name is required"),
        specialty: z.string().optional(),
        username: z.string().min(1, "Username is required"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database unavailable",
        });
      }

      try {
        // Check if username already exists
        const existingCreds = await db
          .select()
          .from(teamCredentials)
          .where(eq(teamCredentials.username, input.username))
          .limit(1);

        if (existingCreds.length > 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Username already exists",
          });
        }

        // Create team member
        const memberResult = await db.insert(teamMembers).values({
          displayName: input.displayName,
          specialty: input.specialty || null,
          openId: input.displayName.toLowerCase().replace(/\s+/g, "_"),
          isApproved: 1,
        });

        const teamMemberId = memberResult[0].insertId;

        // Hash password and create credentials
        const passwordHash = await hashPassword(input.password);
        await db.insert(teamCredentials).values({
          teamMemberId,
          username: input.username,
          passwordHash,
          isActive: 1,
        });

        return {
          success: true,
          memberId: teamMemberId,
          message: `Team member "${input.displayName}" added successfully`,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("[Admin] Failed to add member:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to add team member",
        });
      }
    }),

  /**
   * Update team member info
   */
  updateMember: publicProcedure
    .input(
      z.object({
        memberId: z.number(),
        displayName: z.string().min(1).optional(),
        specialty: z.string().optional(),
        isApproved: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database unavailable",
        });
      }

      try {
        const updateData: Record<string, unknown> = {};
        if (input.displayName !== undefined) updateData.displayName = input.displayName;
        if (input.specialty !== undefined) updateData.specialty = input.specialty;
        if (input.isApproved !== undefined) updateData.isApproved = input.isApproved;

        await db
          .update(teamMembers)
          .set(updateData)
          .where(eq(teamMembers.id, input.memberId));

        return { success: true, message: "Team member updated" };
      } catch (error) {
        console.error("[Admin] Failed to update member:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update team member",
        });
      }
    }),

  /**
   * Reset team member password
   */
  resetPassword: publicProcedure
    .input(
      z.object({
        credentialId: z.number(),
        newPassword: z.string().min(8, "Password must be at least 8 characters"),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database unavailable",
        });
      }

      try {
        const passwordHash = await hashPassword(input.newPassword);
        await db
          .update(teamCredentials)
          .set({ passwordHash })
          .where(eq(teamCredentials.id, input.credentialId));

        return { success: true, message: "Password reset successfully" };
      } catch (error) {
        console.error("[Admin] Failed to reset password:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to reset password",
        });
      }
    }),

  /**
   * Deactivate credentials
   */
  deactivateCredential: publicProcedure
    .input(z.object({ credentialId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database unavailable",
        });
      }

      try {
        await db
          .update(teamCredentials)
          .set({ isActive: 0 })
          .where(eq(teamCredentials.id, input.credentialId));

        return { success: true, message: "Credentials deactivated" };
      } catch (error) {
        console.error("[Admin] Failed to deactivate credential:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to deactivate credential",
        });
      }
    }),

  /**
   * Delete team member (and their credentials)
   */
  deleteMember: publicProcedure
    .input(z.object({ memberId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database unavailable",
        });
      }

      try {
        // Delete credentials first
        await db
          .delete(teamCredentials)
          .where(eq(teamCredentials.teamMemberId, input.memberId));

        // Delete team member
        await db
          .delete(teamMembers)
          .where(eq(teamMembers.id, input.memberId));

        return { success: true, message: "Team member deleted" };
      } catch (error) {
        console.error("[Admin] Failed to delete member:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete team member",
        });
      }
    }),

  /**
   * Get all hunters profiles for admin
   */
  listHuntersProfiles: publicProcedure.query(async () => {
    try {
      const profiles = await getAllHuntersProfiles();
      return profiles;
    } catch (error) {
      console.error("[Admin] Failed to list hunters profiles:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch hunters profiles",
      });
    }
  }),

  /**
   * Create or update a hunters profile
   */
  upsertHuntersProfile: publicProcedure
    .input(
      z.object({
        id: z.number().optional(),
        teamMemberId: z.number(),
        displayName: z.string().min(1, "Display name is required"),
        title: z.string().optional(),
        bio: z.string().optional(),
        specialty: z.string().optional(),
        avatarUrl: z.string().optional(),
        htbProfile: z.string().optional(),
        thmProfile: z.string().optional(),
        githubProfile: z.string().optional(),
        twitterProfile: z.string().optional(),
        flagsCount: z.number().default(0),
        ranking: z.number().optional(),
        isVisible: z.number().default(1),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await upsertHuntersProfile(input);
        return {
          success: true,
          message: input.id ? "Hunter profile updated" : "Hunter profile created",
          profile: result,
        };
      } catch (error) {
        console.error("[Admin] Failed to upsert hunters profile:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to save hunters profile",
        });
      }
    }),

  /**
   * Delete a hunters profile
   */
  deleteHuntersProfile: publicProcedure
    .input(z.object({ profileId: z.number() }))
    .mutation(async ({ input }) => {
      try {
        await deleteHuntersProfile(input.profileId);
        return { success: true, message: "Hunter profile deleted" };
      } catch (error) {
        console.error("[Admin] Failed to delete hunters profile:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete hunters profile",
        });
      }
    }),

  /**
   * Get activity log with optional filtering
   */
  getActivityLog: publicProcedure
    .input(
      z.object({
        teamMemberId: z.number().optional(),
        action: z.string().optional(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      try {
        const logs = await getActivityLog({
          teamMemberId: input.teamMemberId,
          action: input.action,
          limit: input.limit,
          offset: input.offset,
        });

        return logs;
      } catch (error) {
        console.error("[Admin] Failed to fetch activity log:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch activity log",
        });
      }
    }),

  /**
   * Get all platforms for admin
   */
  listPlatforms: publicProcedure.query(async () => {
    try {
      const platformsList = await getAllPlatforms();
      return platformsList;
    } catch (error) {
      console.error("[Admin] Failed to list platforms:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch platforms",
      });
    }
  }),

  /**
   * Create or update a platform
   */
  upsertPlatformData: publicProcedure
    .input(
      z.object({
        id: z.number().optional(),
        name: z.string().min(1, "Platform name is required"),
        abbreviation: z.string().min(1, "Abbreviation is required"),
        ranking: z.string().min(1, "Ranking is required"),
        description: z.string().optional(),
        tags: z.string().optional(),
        displayOrder: z.number().default(0),
        isVisible: z.number().default(1),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await upsertPlatform(input);
        return {
          success: true,
          message: input.id ? "Platform updated" : "Platform created",
          platform: result,
        };
      } catch (error) {
        console.error("[Admin] Failed to upsert platform:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to save platform",
        });
      }
    }),

  /**
   * Delete a platform
   */
  deletePlatformData: publicProcedure
    .input(z.object({ platformId: z.number() }))
    .mutation(async ({ input }) => {
      try {
        await deletePlatform(input.platformId);
        return { success: true, message: "Platform deleted" };
      } catch (error) {
        console.error("[Admin] Failed to delete platform:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete platform",
        });
      }
    }),

  /**
   * Get all achievements for admin
   */
  listAchievements: publicProcedure.query(async () => {
    try {
      const achievementsList = await getAllAchievements();
      return achievementsList;
    } catch (error) {
      console.error("[Admin] Failed to list achievements:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch achievements",
      });
    }
  }),

  /**
   * Create or update an achievement
   */
  upsertAchievementData: publicProcedure
    .input(
      z.object({
        id: z.number().optional(),
        key: z.string().min(1, "Achievement key is required"),
        label: z.string().min(1, "Label is required"),
        value: z.string().min(1, "Value is required"),
        description: z.string().optional(),
        icon: z.string().optional(),
        displayOrder: z.number().default(0),
        isVisible: z.number().default(1),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await upsertAchievement(input);
        return {
          success: true,
          message: input.id ? "Achievement updated" : "Achievement created",
          achievement: result,
        };
      } catch (error) {
        console.error("[Admin] Failed to upsert achievement:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to save achievement",
        });
      }
    }),

  /**
   * Delete an achievement
   */
  deleteAchievementData: publicProcedure
    .input(z.object({ achievementId: z.number() }))
    .mutation(async ({ input }) => {
      try {
        await deleteAchievement(input.achievementId);
        return { success: true, message: "Achievement deleted" };
      } catch (error) {
        console.error("[Admin] Failed to delete achievement:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete achievement",
        });
      }
    }),
});
