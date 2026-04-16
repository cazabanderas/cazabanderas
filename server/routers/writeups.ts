import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { 
  getPublicWriteups,
  getTeamMemberWriteups,
  getAllTeamWriteups,
  getWriteupById,
  createWriteup,
  updateWriteup,
  deleteWriteup,
  toggleWriteupVisibility,
  incrementWriteupViews,
  getDb,
  isTeamMember
} from "../db";
import { TRPCError } from "@trpc/server";
import { teamWriteups } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const writeupsRouter = router({
  /**
   * Get all public write-ups (for homepage)
   */
  getPublic: publicProcedure.query(async () => {
    try {
      const writeups = await getPublicWriteups();
      return writeups;
    } catch (error) {
      console.error("[Writeups] Failed to get public write-ups:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch write-ups",
      });
    }
  }),

  /**
   * Get all write-ups for a team member
   */
  getByTeamMember: publicProcedure
    .input(z.object({ teamMemberId: z.number() }))
    .query(async ({ input }) => {
      try {
        const writeups = await getTeamMemberWriteups(input.teamMemberId);
        return writeups;
      } catch (error) {
        console.error("[Writeups] Failed to get team member write-ups:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch write-ups",
        });
      }
    }),

  /**
   * Get all team write-ups (team dashboard)
   */
  getAllTeam: publicProcedure.query(async () => {
    try {
      const writeups = await getAllTeamWriteups();
      return writeups;
    } catch (error) {
      console.error("[Writeups] Failed to get all team write-ups:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch write-ups",
      });
    }
  }),

  /**
   * Get a single write-up by ID
   */
  getById: publicProcedure
    .input(z.object({ writeupId: z.number() }))
    .query(async ({ input }) => {
      try {
        const writeup = await getWriteupById(input.writeupId);
        if (!writeup) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Write-up not found",
          });
        }
        // Increment view count
        await incrementWriteupViews(input.writeupId);
        return writeup;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("[Writeups] Failed to get write-up:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch write-up",
        });
      }
    }),

  /**
   * Create a new write-up
   */
  create: publicProcedure
    .input(
      z.object({
        teamMemberId: z.number(),
        title: z.string().min(1, "Title is required"),
        content: z.string().min(1, "Content is required"),
        challengeName: z.string().optional(),
        platform: z.string().optional(),
        difficulty: z.string().optional(),
        category: z.string().optional(),
        isPublic: z.number().default(0),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Verify team member exists
        const db = await getDb();
        if (!db) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Database unavailable",
          });
        }

        const member = await db
          .select()
          .from(teamWriteups)
          .limit(1);

        const result = await createWriteup({
          teamMemberId: input.teamMemberId,
          title: input.title,
          content: input.content,
          challengeName: input.challengeName || null,
          platform: input.platform || null,
          difficulty: input.difficulty || null,
          category: input.category || null,
          isPublic: input.isPublic,
        });

        return {
          success: true,
          message: "Write-up created successfully",
          writeup: result,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("[Writeups] Failed to create write-up:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create write-up",
        });
      }
    }),

  /**
   * Update a write-up
   */
  update: publicProcedure
    .input(
      z.object({
        writeupId: z.number(),
        title: z.string().optional(),
        content: z.string().optional(),
        challengeName: z.string().optional(),
        platform: z.string().optional(),
        difficulty: z.string().optional(),
        category: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const { writeupId, ...updateData } = input;
        const result = await updateWriteup(writeupId, updateData);

        return {
          success: true,
          message: "Write-up updated successfully",
          writeup: result,
        };
      } catch (error) {
        console.error("[Writeups] Failed to update write-up:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update write-up",
        });
      }
    }),

  /**
   * Delete a write-up
   */
  delete: publicProcedure
    .input(z.object({ writeupId: z.number() }))
    .mutation(async ({ input }) => {
      try {
        await deleteWriteup(input.writeupId);

        return {
          success: true,
          message: "Write-up deleted successfully",
        };
      } catch (error) {
        console.error("[Writeups] Failed to delete write-up:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete write-up",
        });
      }
    }),

  /**
   * Toggle write-up visibility (public/private)
   */
  toggleVisibility: publicProcedure
    .input(
      z.object({
        writeupId: z.number(),
        isPublic: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await toggleWriteupVisibility(input.writeupId, input.isPublic);

        return {
          success: true,
          message: input.isPublic ? "Write-up published" : "Write-up made private",
          writeup: result,
        };
      } catch (error) {
        console.error("[Writeups] Failed to toggle visibility:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to toggle write-up visibility",
        });
      }
    }),
});
