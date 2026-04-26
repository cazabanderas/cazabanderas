import { z } from "zod";
import { publicProcedure, router, adminProcedure } from "../_core/trpc";
import {
  createActiveCTFChallenge,
  getActiveCTFChallenges,
  getActiveCTFChallengeById,
  updateActiveCTFChallenge,
  deleteActiveCTFChallenge,
  updateChallengeStatuses,
} from "../db";

export const challengesRouter = router({
  /**
   * Get all active CTF challenges with optional filtering
   */
  getAll: publicProcedure
    .input(
      z.object({
        status: z.enum(["upcoming", "active", "completed"]).optional(),
        platform: z.string().optional(),
        isPriority: z.boolean().optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        // Update statuses based on current date
        await updateChallengeStatuses();

        const challenges = await getActiveCTFChallenges({
          status: input.status,
          platform: input.platform,
          isPriority: input.isPriority,
        });

        return {
          challenges,
          total: challenges.length,
        };
      } catch (error) {
        console.error("[Challenges] Failed to get challenges:", error);
        throw error;
      }
    }),

  /**
   * Get a single challenge by ID
   */
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      try {
        const challenge = await getActiveCTFChallengeById(input.id);
        return challenge;
      } catch (error) {
        console.error("[Challenges] Failed to get challenge:", error);
        throw error;
      }
    }),

  /**
   * Create a new challenge (admin only)
   */
  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1, "Challenge name required"),
        platform: z.string().min(1, "Platform required"),
        url: z.string().url().optional(),
        startDate: z.date(),
        endDate: z.date(),
        difficulty: z.enum(["easy", "medium", "hard", "expert"]).optional(),
        totalPoints: z.number().optional(),
        totalFlags: z.number().optional(),
        notes: z.string().optional(),
        isPriority: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await createActiveCTFChallenge({
          name: input.name,
          platform: input.platform,
          url: input.url,
          startDate: input.startDate,
          endDate: input.endDate,
          difficulty: input.difficulty,
          totalPoints: input.totalPoints,
          totalFlags: input.totalFlags,
          notes: input.notes,
          isPriority: input.isPriority,
        });

        return {
          success: true,
          message: "Challenge created successfully",
          result,
        };
      } catch (error) {
        console.error("[Challenges] Failed to create challenge:", error);
        throw error;
      }
    }),

  /**
   * Update a challenge (admin only)
   */
  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        platform: z.string().optional(),
        url: z.string().url().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        status: z.enum(["upcoming", "active", "completed"]).optional(),
        difficulty: z.enum(["easy", "medium", "hard", "expert"]).optional(),
        totalPoints: z.number().optional(),
        teamScore: z.number().optional(),
        flagsCaptured: z.number().optional(),
        totalFlags: z.number().optional(),
        teamRank: z.number().optional(),
        totalTeams: z.number().optional(),
        notes: z.string().optional(),
        isPriority: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const { id, ...data } = input;
        const result = await updateActiveCTFChallenge(id, data);

        return {
          success: true,
          message: "Challenge updated successfully",
          result,
        };
      } catch (error) {
        console.error("[Challenges] Failed to update challenge:", error);
        throw error;
      }
    }),

  /**
   * Delete a challenge (admin only)
   */
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      try {
        const result = await deleteActiveCTFChallenge(input.id);

        return {
          success: true,
          message: "Challenge deleted successfully",
          result,
        };
      } catch (error) {
        console.error("[Challenges] Failed to delete challenge:", error);
        throw error;
      }
    }),

  /**
   * Update challenge statuses based on current date
   */
  updateStatuses: adminProcedure.mutation(async () => {
    try {
      await updateChallengeStatuses();

      return {
        success: true,
        message: "Challenge statuses updated",
      };
    } catch (error) {
      console.error("[Challenges] Failed to update statuses:", error);
      throw error;
    }
  }),
});
