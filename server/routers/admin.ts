import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { 
  getAllTeamMembers, 
  createTeamCredentials, 
  hashPassword,
  getDb,
  authenticateTeamMember
} from "../db";
import { TRPCError } from "@trpc/server";
import { teamMembers, teamCredentials } from "../../drizzle/schema";
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
});
