import { publicProcedure, router } from "../_core/trpc";
import { getLeaderboard, getMemberLeaderboardStats, recalculateLeaderboard } from "../db";

export const leaderboardRouter = router({
  /**
   * Get the full leaderboard with all members ranked by points
   */
  getLeaderboard: publicProcedure.query(async () => {
    try {
      const leaderboard = await getLeaderboard();
      return {
        success: true,
        data: leaderboard,
      };
    } catch (error) {
      console.error("[Leaderboard] Failed to get leaderboard:", error);
      return {
        success: false,
        data: [],
        error: "Failed to fetch leaderboard",
      };
    }
  }),

  /**
   * Get stats for a specific member
   */
  getMemberStats: publicProcedure
    .input((val: unknown) => {
      if (typeof val === "object" && val !== null && "memberId" in val) {
        return { memberId: (val as { memberId: unknown }).memberId };
      }
      throw new Error("Invalid input");
    })
    .query(async ({ input }) => {
      try {
        const memberId = Number(input.memberId);
        if (isNaN(memberId)) {
          return {
            success: false,
            data: null,
            error: "Invalid member ID",
          };
        }

        const stats = await getMemberLeaderboardStats(memberId);
        return {
          success: true,
          data: stats,
        };
      } catch (error) {
        console.error("[Leaderboard] Failed to get member stats:", error);
        return {
          success: false,
          data: null,
          error: "Failed to fetch member stats",
        };
      }
    }),

  /**
   * Get top 10 members for quick display
   */
  getTopMembers: publicProcedure
    .input((val: unknown) => {
      if (typeof val === "object" && val !== null && "limit" in val) {
        return { limit: Math.min(Number((val as { limit: unknown }).limit) || 10, 50) };
      }
      return { limit: 10 };
    })
    .query(async ({ input }) => {
      try {
        const leaderboard = await getLeaderboard();
        const topMembers = leaderboard.slice(0, input.limit);
        return {
          success: true,
          data: topMembers,
        };
      } catch (error) {
        console.error("[Leaderboard] Failed to get top members:", error);
        return {
          success: false,
          data: [],
          error: "Failed to fetch top members",
        };
      }
    }),

  /**
   * Get members by tier (bronze, silver, gold, platinum)
   */
  getMembersByTier: publicProcedure
    .input((val: unknown) => {
      if (typeof val === "object" && val !== null && "tier" in val) {
        return { tier: (val as { tier: unknown }).tier };
      }
      throw new Error("Invalid input");
    })
    .query(async ({ input }) => {
      try {
        const leaderboard = await getLeaderboard();
        const filtered = leaderboard.filter((member) => member.tier === input.tier);
        return {
          success: true,
          data: filtered,
        };
      } catch (error) {
        console.error("[Leaderboard] Failed to get members by tier:", error);
        return {
          success: false,
          data: [],
          error: "Failed to fetch members by tier",
        };
      }
    }),

  /**
   * Get leaderboard statistics (total members, average flags, etc.)
   */
  getLeaderboardStats: publicProcedure.query(async () => {
    try {
      const leaderboard = await getLeaderboard();

      if (leaderboard.length === 0) {
        return {
          success: true,
          data: {
            totalMembers: 0,
            averageFlags: 0,
            averagePoints: 0,
            topMember: null,
          },
        };
      }

      const totalFlags = leaderboard.reduce((sum, m) => sum + (m.totalFlags || 0), 0);
      const totalPoints = leaderboard.reduce((sum, m) => sum + (m.totalPoints || 0), 0);

      return {
        success: true,
        data: {
          totalMembers: leaderboard.length,
          averageFlags: Math.round(totalFlags / leaderboard.length),
          averagePoints: Math.round(totalPoints / leaderboard.length),
          topMember: leaderboard[0] || null,
        },
      };
    } catch (error) {
      console.error("[Leaderboard] Failed to get stats:", error);
      return {
        success: false,
        data: null,
        error: "Failed to fetch leaderboard statistics",
      };
    }
  }),
});
