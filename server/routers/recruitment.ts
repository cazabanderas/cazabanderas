import { z } from "zod";
import { publicProcedure, router, adminProcedure } from "../_core/trpc";
import {
  submitRecruitmentApplication,
  getRecruitmentApplications,
  getRecruitmentApplicationById,
  updateRecruitmentApplicationStatus,
} from "../db";

/**
 * Calculate automated score for a recruitment application
 * Based on: challenge count, category diversity, platform reputation, GitHub activity
 */
function calculateAutomatedScore(data: {
  htbProfile?: string;
  thmProfile?: string;
  hcProfile?: string;
  githubProfile?: string;
  blogUrl?: string;
  categoriesToImprove?: string;
}): number {
  let score = 0;

  // Platform Reputation (20 points max)
  if (data.htbProfile) score += 8;
  if (data.thmProfile) score += 8;
  if (data.hcProfile) score += 4;

  // GitHub Activity (20 points max)
  if (data.githubProfile) {
    score += 5; // Has GitHub profile
    // Additional points for blog/writeups (we can't verify without API, so give benefit of doubt)
    score += 10;
  }

  // Blog presence (5 points max)
  if (data.blogUrl) score += 5;

  // Category diversity (20 points max)
  if (data.categoriesToImprove) {
    const categories = data.categoriesToImprove.split(",").filter((c) => c.trim());
    if (categories.length === 1) score += 5;
    else if (categories.length === 2) score += 10;
    else if (categories.length >= 3) score += 20;
  }

  // Application quality (10 points max) - will be assessed manually
  // Base score for completing the form
  score += 10;

  return Math.min(score, 100); // Cap at 100
}

/**
 * Determine skill level based on automated score
 */
function getSkillLevel(score: number): "Beginner" | "Intermediate" | "Advanced" {
  if (score <= 40) return "Beginner";
  if (score <= 70) return "Intermediate";
  return "Advanced";
}

export const recruitmentRouter = router({
  /**
   * Submit a new recruitment application
   */
  submit: publicProcedure
    .input(
      z.object({
        discordUsername: z.string().min(1, "Discord username required"),
        htbProfile: z.string().url().optional().or(z.literal("")),
        thmProfile: z.string().url().optional().or(z.literal("")),
        hcProfile: z.string().url().optional().or(z.literal("")),
        githubProfile: z.string().url().optional().or(z.literal("")),
        blogUrl: z.string().url().optional().or(z.literal("")),
        motivation: z.string().min(10, "Motivation must be at least 10 characters"),
        mainSpecialty: z.string().min(1, "Main specialty required"),
        yearsOfExperience: z.string().min(1, "Years of experience required"),
        biggestChallenge: z.string().optional(),
        categoriesToImprove: z.string().optional(),
        weeklyCommitment: z.string().min(1, "Weekly commitment required"),
        idealTeamDynamic: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Calculate automated score
        const automatedScore = calculateAutomatedScore({
          htbProfile: input.htbProfile || undefined,
          thmProfile: input.thmProfile || undefined,
          hcProfile: input.hcProfile || undefined,
          githubProfile: input.githubProfile || undefined,
          blogUrl: input.blogUrl || undefined,
          categoriesToImprove: input.categoriesToImprove,
        });

        const skillLevel = getSkillLevel(automatedScore);

        // Submit application
        const result = await submitRecruitmentApplication({
          discordUsername: input.discordUsername,
          htbProfile: input.htbProfile || undefined,
          thmProfile: input.thmProfile || undefined,
          hcProfile: input.hcProfile || undefined,
          githubProfile: input.githubProfile || undefined,
          blogUrl: input.blogUrl || undefined,
          motivation: input.motivation,
          mainSpecialty: input.mainSpecialty,
          yearsOfExperience: input.yearsOfExperience,
          biggestChallenge: input.biggestChallenge,
          categoriesToImprove: input.categoriesToImprove,
          weeklyCommitment: input.weeklyCommitment,
          idealTeamDynamic: input.idealTeamDynamic,
          automatedScore,
        });

        return {
          success: true,
          automatedScore,
          skillLevel,
          message: "Application submitted successfully!",
        };
      } catch (error) {
        console.error("[Recruitment] Failed to submit application:", error);
        throw error;
      }
    }),

  /**
   * Get all applications (admin only)
   */
  getApplications: adminProcedure
    .input(
      z.object({
        status: z.enum(["pending", "reviewed", "accepted", "rejected"]).optional(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      try {
        const applications = await getRecruitmentApplications({
          status: input.status,
          limit: input.limit,
          offset: input.offset,
        });

        return {
          applications,
          total: applications.length,
        };
      } catch (error) {
        console.error("[Recruitment] Failed to get applications:", error);
        throw error;
      }
    }),

  /**
   * Get a single application by ID (admin only)
   */
  getApplication: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      try {
        const application = await getRecruitmentApplicationById(input.id);
        return application;
      } catch (error) {
        console.error("[Recruitment] Failed to get application:", error);
        throw error;
      }
    }),

  /**
   * Update application status and add review notes (admin only)
   */
  updateStatus: adminProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pending", "reviewed", "accepted", "rejected"]),
        reviewNotes: z.string().optional(),
        feedbackMessage: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await updateRecruitmentApplicationStatus(
          input.id,
          input.status,
          input.reviewNotes,
          input.feedbackMessage
        );

        return {
          success: true,
          result,
          message: `Application status updated to ${input.status}`,
        };
      } catch (error) {
        console.error("[Recruitment] Failed to update application:", error);
        throw error;
      }
    }),
});
