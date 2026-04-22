import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";

// Category mapping from HTB challenge names/types to our arsenal categories
const CATEGORY_MAPPING: Record<string, string> = {
  // OSINT
  "osint": "OSINT",
  "intelligence": "OSINT",
  
  // Mobile
  "mobile": "Mobile",
  "android": "Mobile",
  "ios": "Mobile",
  
  // Web
  "web": "Web",
  "web-exploitation": "Web",
  
  // GamePwn
  "gamepwn": "GamePwn",
  "game": "GamePwn",
  
  // Reversing
  "reversing": "Reversing",
  "reverse-engineering": "Reversing",
  
  // AI/ML
  "ai": "AI/ML",
  "ml": "AI/ML",
  "machine-learning": "AI/ML",
  
  // Crypto
  "crypto": "Crypto",
  "cryptography": "Crypto",
  
  // Hardware
  "hardware": "Hardware",
  
  // Coding
  "coding": "Coding",
  "programming": "Coding",
  
  // Forensics
  "forensics": "Forensics",
  
  // Blockchain
  "blockchain": "Blockchain",
  "web3": "Blockchain",
};

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
  flag_title: string;
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

  // Get challenge counts by category
  getChallengeCounts: publicProcedure.query(async () => {
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
        Coding: 0,
        Forensics: 0,
        Blockchain: 0,
      };

      // Process activities to count by category
      activities.forEach((activity) => {
        // Try to determine category from challenge name or type
        let category = "Web"; // default fallback
        
        const name = activity.name.toLowerCase();
        const type = activity.type.toLowerCase();
        
        // Check name first
        for (const [key, value] of Object.entries(CATEGORY_MAPPING)) {
          if (name.includes(key) || type.includes(key)) {
            category = value;
            break;
          }
        }
        
        if (counts.hasOwnProperty(category)) {
          counts[category]++;
        }
      });

      return Object.entries(counts).map(([category, count]) => ({
        category,
        count,
      }));
    } catch (error) {
      console.error("Error fetching HTB challenge counts:", error);
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

      // Get latest 3 activities
      const latestPwns: RecentPwn[] = activities.slice(0, 3).map((activity) => {
        // Determine category
        let category = "Web";
        const name = activity.name.toLowerCase();
        const type = activity.type.toLowerCase();
        
        for (const [key, value] of Object.entries(CATEGORY_MAPPING)) {
          if (name.includes(key) || type.includes(key)) {
            category = value;
            break;
          }
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
});
