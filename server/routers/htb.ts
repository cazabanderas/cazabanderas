import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { completedChallenges, CompletedChallenge, htbTeamMembers, HTBTeamMember } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

interface HTBActivity {
  user: {
    id: number;
    name: string;
    public: number;
    avatar_thumb: string;
  };
  date: string;
  date_diff: string;
  type: string;
  first_blood: boolean;
  object_type: string;
  id: number;
  name: string;
  points: number;
  flag_title?: string;
  challenge_category?: string;
  avatar_url?: string;
}

interface ActivityTag {
  type: string;
  category: string;
}

interface ChallengeCount {
  category: string;
  count: number;
}

interface RecentPwn {
  username: string;
  challengeName: string;
  category: string;
  date: string;
  points: number;
}

interface HTBTeamMemberData {
  id: number;
  name: string;
  avatar: string;
}

const HTB_API_URL = "https://labs.hackthebox.com/api/v4";
const HTB_TEAM_ID = 8179;

export const htbRouter = router({
  getTeamActivity: publicProcedure.query(async () => {
    try {
      const token = process.env.HTB_API_TOKEN;
      if (!token) {
        throw new Error("HTB_API_TOKEN not configured");
      }

      const response = await fetch(
        `${HTB_API_URL}/team/activity/${HTB_TEAM_ID}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTB API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching HTB team activity:", error);
      throw error;
    }
  }),

  getChallengeCounts: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      const challenges = await db
        .select()
        .from(completedChallenges);

      const counts: Record<string, number> = {};
      challenges.forEach((challenge: CompletedChallenge) => {
        const category = challenge.category;
        counts[category] = (counts[category] || 0) + 1;
      });

      return Object.entries(counts).map(([category, count]) => ({
        category,
        count,
      }));
    } catch (error) {
      console.error("Error getting challenge counts:", error);
      throw error;
    }
  }),

  getAllChallenges: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      const challenges = await db
        .select()
        .from(completedChallenges);

      return challenges;
    } catch (error) {
      console.error("Error getting all challenges:", error);
      throw error;
    }
  }),

  addChallenge: publicProcedure
    .input(
      z.object({
        name: z.string(),
        category: z.string(),
        difficulty: z.string().optional(),
        points: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          throw new Error("Database not available");
        }

        // Check if challenge already exists
        const existing = await db
          .select()
          .from(completedChallenges)
          .where(eq(completedChallenges.name, input.name));

        if (existing.length > 0) {
          return {
            success: false,
            message: "Challenge already exists",
          };
        }

        await db.insert(completedChallenges).values({
          name: input.name,
          category: input.category,
          difficulty: input.difficulty || "Unknown",
          points: input.points || 0,
        });

        return {
          success: true,
          message: "Challenge added successfully",
        };
      } catch (error) {
        console.error("Error adding challenge:", error);
        throw error;
      }
    }),

  syncHTBActivity: publicProcedure.mutation(async () => {
    try {
      const token = process.env.HTB_API_TOKEN;
      if (!token) {
        throw new Error("HTB_API_TOKEN not configured");
      }

      const response = await fetch(
        `${HTB_API_URL}/team/activity/${HTB_TEAM_ID}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTB API error: ${response.status}`);
      }

      const activities: HTBActivity[] = await response.json();
      const db = await getDb();

      if (!db) {
        throw new Error("Database not available");
      }

      let addedCount = 0;
      let skippedCount = 0;

      for (const activity of activities) {
        if (activity.type === "challenge") {
          const existing = await db
            .select()
            .from(completedChallenges)
            .where(eq(completedChallenges.name, activity.name));

          if (existing.length === 0) {
            await db.insert(completedChallenges).values({
              name: activity.name,
              category: activity.challenge_category || "Unknown",
              difficulty: "Unknown",
              points: activity.points || 0,
            });
            addedCount++;
          } else {
            skippedCount++;
          }
        }
      }

      return {
        success: true,
        added: addedCount,
        skipped: skippedCount,
      };
    } catch (error) {
      console.error("Error syncing HTB activity:", error);
      throw error;
    }
  }),

  getLatestPwns: publicProcedure.query(async () => {
    try {
      const token = process.env.HTB_API_TOKEN;
      if (!token) {
        throw new Error("HTB_API_TOKEN not configured");
      }

      const response = await fetch(
        `${HTB_API_URL}/team/activity/${HTB_TEAM_ID}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTB API error: ${response.status}`);
      }

      const activities: HTBActivity[] = await response.json();

      // Filter to only challenges and fortresses, get latest 3
      const pwns = activities
        .filter(
          (a) =>
            (a.type === "challenge" || a.type === "fortress") &&
            a.user.public === 1
        )
        .slice(0, 3)
        .map((activity) => ({
          username: activity.user.name,
          challengeName: activity.name,
          category:
            activity.type === "challenge"
              ? activity.challenge_category || "Unknown"
              : "fortress",
          date: activity.date_diff,
          points: activity.points,
        }));

      return pwns;
    } catch (error) {
      console.error("Error getting latest pwns:", error);
      throw error;
    }
  }),

  getHTBTeamMembers: publicProcedure.query(async () => {
    try {
      const token = process.env.HTB_API_TOKEN;
      if (!token) {
        throw new Error("HTB_API_TOKEN not configured");
      }

      const response = await fetch(
        `${HTB_API_URL}/team/members/${HTB_TEAM_ID}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTB API error: ${response.status}`);
      }

      const members: HTBTeamMemberData[] = await response.json();
      return members;
    } catch (error) {
      console.error("Error fetching HTB team members:", error);
      throw error;
    }
  }),

  syncTeamMembers: publicProcedure.mutation(async () => {
    try {
      const token = process.env.HTB_API_TOKEN;
      if (!token) {
        throw new Error("HTB_API_TOKEN not configured");
      }

      const response = await fetch(
        `${HTB_API_URL}/team/members/${HTB_TEAM_ID}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTB API error: ${response.status}`);
      }

      const members: HTBTeamMemberData[] = await response.json();
      const db = await getDb();

      if (!db) {
        throw new Error("Database not available");
      }

      let addedCount = 0;
      let updatedCount = 0;

      for (const member of members) {
        const existing = await db
          .select()
          .from(htbTeamMembers)
          .where(eq(htbTeamMembers.htbUserId, member.id));

        if (existing.length === 0) {
          await db.insert(htbTeamMembers).values({
            htbUserId: member.id,
            htbUsername: member.name,
            displayName: member.name,
            profilePictureUrl: member.avatar,
            isVisible: 1,
          });
          addedCount++;
        } else {
          // Update profile picture if changed
          await db
            .update(htbTeamMembers)
            .set({
              profilePictureUrl: member.avatar,
              syncedAt: new Date(),
            })
            .where(eq(htbTeamMembers.htbUserId, member.id));
          updatedCount++;
        }
      }

      return {
        success: true,
        added: addedCount,
        updated: updatedCount,
      };
    } catch (error) {
      console.error("Error syncing team members:", error);
      throw error;
    }
  }),

  getAllTeamMembers: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      const members = await db
        .select()
        .from(htbTeamMembers)
        .where(eq(htbTeamMembers.isVisible, 1));

      return members;
    } catch (error) {
      console.error("Error getting all team members:", error);
      throw error;
    }
  }),

  updateTeamMember: publicProcedure
    .input(
      z.object({
        id: z.number(),
        displayName: z.string().optional(),
        notes: z.string().optional(),
        title: z.string().optional(),
        bio: z.string().optional(),
        specialties: z.string().optional(),
        htbUrl: z.string().optional(),
        thmUrl: z.string().optional(),
        githubUrl: z.string().optional(),
        linkedinUrl: z.string().optional(),
        blogUrl: z.string().optional(),
        isVisible: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          throw new Error("Database not available");
        }

        await db
          .update(htbTeamMembers)
          .set({
            displayName: input.displayName,
            notes: input.notes,
            title: input.title,
            bio: input.bio,
            specialties: input.specialties,
            htbUrl: input.htbUrl,
            thmUrl: input.thmUrl,
            githubUrl: input.githubUrl,
            linkedinUrl: input.linkedinUrl,
            blogUrl: input.blogUrl,
            isVisible: input.isVisible,
            updatedAt: new Date(),
          })
          .where(eq(htbTeamMembers.id, input.id));

        return {
          success: true,
          message: "Team member updated successfully",
        };
      } catch (error) {
        console.error("Error updating team member:", error);
        throw error;
      }
    }),
});
