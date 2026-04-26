import { describe, it, expect } from 'vitest';
import { appRouter } from '../routers';
import type { TrpcContext } from '../_core/context';

function createTestContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe('HTB Deduplication Logic', () => {
  describe('htb.getAllChallenges', () => {
    it('should return all completed challenges from database', async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);
      
      const challenges = await caller.htb.getAllChallenges();
      
      expect(challenges).toBeDefined();
      expect(Array.isArray(challenges)).toBe(true);
      expect(challenges.length).toBeGreaterThan(0);
    });

    it('should return challenges with required fields', async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);
      
      const challenges = await caller.htb.getAllChallenges();
      
      challenges.forEach((challenge: any) => {
        expect(challenge).toHaveProperty('challengeName');
        expect(challenge).toHaveProperty('category');
        expect(challenge).toHaveProperty('points');
        expect(typeof challenge.challengeName).toBe('string');
        expect(typeof challenge.category).toBe('string');
      });
    });

    it('should have unique challenge names (no duplicates)', async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);
      
      const challenges = await caller.htb.getAllChallenges();
      const names = challenges.map((c: any) => c.challengeName);
      const uniqueNames = new Set(names);
      
      expect(uniqueNames.size).toBe(names.length);
    });
  });

  describe('htb.getChallengeCounts', () => {
    it('should return accurate counts from database', async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);
      
      const counts = await caller.htb.getChallengeCounts();
      const allChallenges = await caller.htb.getAllChallenges();
      
      // Verify counts match actual database data
      const expectedCounts: Record<string, number> = {};
      allChallenges.forEach((challenge: any) => {
        expectedCounts[challenge.category] = (expectedCounts[challenge.category] || 0) + 1;
      });
      
      counts.forEach((count: any) => {
        expect(count.count).toBe(expectedCounts[count.category] || 0);
      });
    });

    it('should have expected categories', async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);
      
      const counts = await caller.htb.getChallengeCounts();
      const categories = counts.map((item: any) => item.category);
      
      const expectedCategories = ['OSINT', 'Mobile', 'Web', 'GamePwn', 'Reversing', 'AI/ML', 'Crypto', 'Hardware', 'Secure Coding', 'Forensics', 'Blockchain', 'Misc'];
      expectedCategories.forEach((cat) => {
        expect(categories).toContain(cat);
      });
    });

    it('should have correct count for OSINT category', async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);
      
      const counts = await caller.htb.getChallengeCounts();
      const osintCount = counts.find((c: any) => c.category === 'OSINT');
      
      expect(osintCount).toBeDefined();
      expect(osintCount?.count).toBe(6);
    });

    it('should have correct count for Web category', async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);
      
      const counts = await caller.htb.getChallengeCounts();
      const webCount = counts.find((c: any) => c.category === 'Web');
      
      expect(webCount).toBeDefined();
      // Web category should have at least 4 challenges (may have more from test runs)
      expect(webCount?.count).toBeGreaterThanOrEqual(4);
    });

    it('should have correct count for Hardware category', async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);
      
      const counts = await caller.htb.getChallengeCounts();
      const hardwareCount = counts.find((c: any) => c.category === 'Hardware');
      
      expect(hardwareCount).toBeDefined();
      expect(hardwareCount?.count).toBe(2);
    });
  });

  describe('htb.addChallenge (deduplication)', () => {
    it('should reject adding a challenge that already exists', async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);
      
      // Try to add a challenge that already exists
      const result = await caller.htb.addChallenge({
        challengeName: 'Low Logic',
        category: 'Hardware',
        difficulty: 'Easy',
        points: 10,
      });
      
      expect(result.success).toBe(false);
      expect(result.message).toContain('already exists');
    });

    it('should successfully add a new challenge', async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);
      
      const uniqueName = `Test Challenge ${Date.now()}`;
      const result = await caller.htb.addChallenge({
        challengeName: uniqueName,
        category: 'Web',
        difficulty: 'Hard',
        points: 50,
      });
      
      expect(result.success).toBe(true);
      
      // Verify it was added
      const allChallenges = await caller.htb.getAllChallenges();
      const added = allChallenges.find((c: any) => c.challengeName === uniqueName);
      expect(added).toBeDefined();
      expect(added?.category).toBe('Web');
    });
  });

  describe('Deduplication Scenario', () => {
    it('should not double-count when multiple users complete the same challenge', async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);
      
      // Get initial counts
      const initialCounts = await caller.htb.getChallengeCounts();
      const initialWebCount = initialCounts.find((c: any) => c.category === 'Web')?.count || 0;
      
      // Get all challenges
      const allChallenges = await caller.htb.getAllChallenges();
      const webChallenges = allChallenges.filter((c: any) => c.category === 'Web');
      
      // Verify count matches actual challenges
      expect(webChallenges.length).toBe(initialWebCount);
      
      // Verify no duplicate challenge names
      const challengeNames = webChallenges.map((c: any) => c.challengeName);
      const uniqueNames = new Set(challengeNames);
      expect(uniqueNames.size).toBe(challengeNames.length);
    });
  });
});
