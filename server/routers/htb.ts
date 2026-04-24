import { router, publicProcedure } from "../_core/trpc";
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

export const htbRouter = router({
  // Fetch team activity from HackTheBox API
  getTeamActivity: publicProcedure.query(async () => {
    try {
      const token = process.env.HTB_API_TOKEN;
      if (!token) {
        throw new Error("HTB_API_TOKEN not configured");
      }

      const response = await fetch("https://labs.hackthebox.com/api/v4/team/activity/8179", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTB API error: ${response.status}`);
      }

      const activities: HTBActivity[] = await response.json();
      return activities;
    } catch (error) {
      console.error("Error fetching HTB team activity:", error);
      throw error;
    }
  }),

  // Get challenge counts by category
  getChallengeCounts: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      const challenges = await db.select().from(completedChallenges);

      // Group by category and count
      const counts: Record<string, number> = {};
      challenges.forEach((challenge) => {
        counts[challenge.category] = (counts[challenge.category] || 0) + 1;
      });

      // Convert to array format
      const result: ChallengeCount[] = Object.entries(counts).map(([category, count]) => ({
        category,
        count,
      }));

      return result;
    } catch (error) {
      console.error("Error getting challenge counts:", error);
      throw error;
    }
  }),

  // Get latest pwns
  getLatestPwns: publicProcedure.query(async () => {
    try {
      const token = process.env.HTB_API_TOKEN;
      if (!token) {
        throw new Error("HTB_API_TOKEN not configured");
      }

      const response = await fetch("https://labs.hackthebox.com/api/v4/team/activity/8179", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTB API error: ${response.status}`);
      }

      const activities: HTBActivity[] = await response.json();

      // Filter for challenges only and get latest 3
      const pwns = activities
        .filter((activity) => activity.type === "challenge")
        .slice(0, 3)
        .map((activity) => ({
          username: activity.user.name,
          challengeName: activity.name,
          category: activity.challenge_category || "Web",
          date: activity.date_diff,
          points: activity.points,
        }));

      return pwns;
    } catch (error) {
      console.error("Error fetching latest pwns:", error);
      throw error;
    }
  }),

  // Sync HTB activity and auto-add new challenges
  syncHTBActivity: publicProcedure.mutation(async () => {
    try {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      const token = process.env.HTB_API_TOKEN;
      if (!token) {
        throw new Error("HTB_API_TOKEN not configured");
      }

      const response = await fetch("https://labs.hackthebox.com/api/v4/team/activity/8179", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTB API error: ${response.status}`);
      }

      const activities: HTBActivity[] = await response.json();
      let newChallengesAdded = 0;

      // Process each activity
      for (const activity of activities) {
        // Only process challenges, skip fortresses and other types
        if (activity.type !== "challenge") {
          continue;
        }

        // Check if challenge already exists in database
        const existing = await db
          .select()
          .from(completedChallenges)
          .where(eq(completedChallenges.challengeName, activity.name))
          .limit(1);

        // If challenge doesn't exist, add it
        if (existing.length === 0) {
          // Use challenge_category from API if available, otherwise fallback to keyword matching
          let category = activity.challenge_category || "Web";

          // If no challenge_category, try to determine from name
          if (!activity.challenge_category) {
            const name = activity.name.toLowerCase();

            if (name.includes("osint")) category = "OSINT";
            else if (name.includes("mobile")) category = "Mobile";
            else if (name.includes("web")) category = "Web";
            else if (name.includes("game")) category = "GamePwn";
            else if (name.includes("reverse")) category = "Reversing";
            else if (name.includes("ai") || name.includes("ml")) category = "AI/ML";
            else if (name.includes("crypto")) category = "Crypto";
            else if (name.includes("hardware")) category = "Hardware";
            else if (name.includes("coding")) category = "Coding";
            else if (name.includes("forensics")) category = "Forensics";
            else if (name.includes("blockchain")) category = "Blockchain";
            else if (name.includes("misc")) category = "Misc";
          }

          await db.insert(completedChallenges).values({
            challengeName: activity.name,
            category,
            difficulty: "Medium", // Default, could be enhanced
            points: activity.points,
            completedAt: new Date(),
          });

          newChallengesAdded++;
        }
      }

      return {
        success: true,
        newChallengesAdded,
        message: `Synced HTB activity. Added ${newChallengesAdded} new challenge(s).`,
      };
    } catch (error) {
      console.error("Error syncing HTB activity:", error);
      throw error;
    }
  }),

  // Get all completed challenges with details
  getAllChallenges: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }
      const challenges = await db.select().from(completedChallenges);
      return challenges;
    } catch (error) {
      console.error("Error fetching all challenges:", error);
      throw error;
    }
  }),

  // Manually add a challenge (for admin use)
  addChallenge: publicProcedure
    .input(
      z.object({
        challengeName: z.string(),
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
          .where(eq(completedChallenges.challengeName, input.challengeName))
          .limit(1);

        if (existing.length > 0) {
          throw new Error("Challenge already exists in database");
        }

        await db.insert(completedChallenges).values({
          challengeName: input.challengeName,
          category: input.category,
          difficulty: input.difficulty || "Medium",
          points: input.points || 0,
          completedAt: new Date(),
        });

        return {
          success: true,
          message: `Added challenge: ${input.challengeName}`,
        };
      } catch (error) {
        console.error("Error adding challenge:", error);
        throw error;
      }
    }),

  // Fetch team members from HackTheBox API
  getHTBTeamMembers: publicProcedure.query(async () => {
    try {
      const token = process.env.HTB_API_TOKEN;
      if (!token) {
        throw new Error("HTB_API_TOKEN not configured");
      }

      const response = await fetch("https://labs.hackthebox.com/api/v4/team/members/8179", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTB API error: ${response.status}`);
      }

      const data = await response.json();
      // HTB API returns members array
      const members: HTBTeamMemberData[] = Array.isArray(data) ? data : data.members || [];

      return members;
    } catch (error) {
      console.error("Error fetching HTB team members:", error);
      throw error;
    }
  }),

  // Sync team members from HTB to database
  syncTeamMembers: publicProcedure.mutation(async () => {
    try {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      const token = process.env.HTB_API_TOKEN;
      if (!token) {
        throw new Error("HTB_API_TOKEN not configured");
      }

      const response = await fetch("https://labs.hackthebox.com/api/v4/team/members/8179", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTB API error: ${response.status}`);
      }

      const data = await response.json();
      const members: HTBTeamMemberData[] = Array.isArray(data) ? data : data.members || [];

      let newMembersAdded = 0;
      let membersUpdated = 0;

      // Process each member
      for (const member of members) {
        // Check if member already exists
        const existing = await db
          .select()
          .from(htbTeamMembers)
          .where(eq(htbTeamMembers.htbUserId, member.id))
          .limit(1);

        if (existing.length === 0) {
          // Add new member
          await db.insert(htbTeamMembers).values({
            htbUserId: member.id,
            htbUsername: member.name,
            displayName: member.name,
            profilePictureUrl: member.avatar,
            isVisible: 1,
            syncedAt: new Date(),
          });
          newMembersAdded++;
        } else {
          // Update existing member's profile picture if changed
          if (existing[0].profilePictureUrl !== member.avatar) {
            await db
              .update(htbTeamMembers)
              .set({
                profilePictureUrl: member.avatar,
                syncedAt: new Date(),
              })
              .where(eq(htbTeamMembers.htbUserId, member.id));
            membersUpdated++;
          }
        }
      }

      return {
        success: true,
        newMembersAdded,
        membersUpdated,
        message: `Synced HTB team members. Added ${newMembersAdded}, updated ${membersUpdated}.`,
      };
    } catch (error) {
      console.error("Error syncing team members:", error);
      throw error;
    }
  }),

  // Get all team members from database
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
      console.error("Error fetching team members:", error);
      throw error;
    }
  }),

  // Update team member (admin only)
  updateTeamMember: publicProcedure
    .input(
      z.object({
        id: z.number(),
        displayName: z.string().optional(),
        notes: z.string().optional(),
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
