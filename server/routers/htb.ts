import { router, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { completedChallenges, CompletedChallenge } from "../../drizzle/schema";
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

  // Get challenge counts by category from database (with deduplication)
  getChallengeCounts: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }
      // Fetch all completed challenges from database
      const allChallenges = await db.select().from(completedChallenges);

      // Count challenges by category
      const counts: Record<string, number> = {
        OSINT: 0,
        Mobile: 0,
        Web: 0,
        GamePwn: 0,
        Reversing: 0,
        "AI/ML": 0,
        Crypto: 0,
        Hardware: 0,
        "Secure Coding": 0,
        Forensics: 0,
        Blockchain: 0,
        Misc: 0,
      };

      // Count challenges by category
      allChallenges.forEach((challenge: any) => {
        const category = challenge.category;
        if (counts.hasOwnProperty(category)) {
          counts[category]++;
        }
      });

      return Object.entries(counts).map(([category, count]) => ({
        category,
        count,
      }));
    } catch (error) {
      console.error("Error fetching challenge counts:", error);
      throw error;
    }
  }),

  // Get latest 3 pwns from team activity
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

      // Get latest 3 activities and map to our format
      const latestPwns: RecentPwn[] = activities.slice(0, 3).map((activity) => {
        // Extract category based on activity type
        let category = "Web"; // Default fallback
        
        if (activity.type === "challenge" && activity.challenge_category) {
          // For challenges, use the challenge_category field
          category = activity.challenge_category;
        } else if (activity.type === "fortress") {
          // For fortresses, use "fortress" as the category
          category = "fortress";
        } else if (activity.type) {
          // For other types, use the type field
          category = activity.type;
        }

        return {
          username: activity.user.name,
          challengeName: activity.name,
          category,
          date: activity.date_diff,
          points: activity.points,
        };
      });

      return latestPwns;
    } catch (error) {
      console.error("Error fetching latest HTB pwns:", error);
      throw error;
    }
  }),

  // Sync HTB activity with database - checks for new challenges and adds them if not already logged
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
});
