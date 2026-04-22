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

describe('HTB Router Integration', () => {
  describe('htb.getTeamActivity', () => {
    it('should fetch team activity from HTB API', async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);
      
      const activities = await caller.htb.getTeamActivity();
      
      expect(activities).toBeDefined();
      expect(Array.isArray(activities)).toBe(true);
      expect(activities.length).toBeGreaterThan(0);
    });

    it('should return activity objects with required fields', async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);
      
      const activities = await caller.htb.getTeamActivity();
      
      if (activities.length > 0) {
        const activity = activities[0];
        expect(activity).toHaveProperty('user');
        expect(activity).toHaveProperty('date');
        expect(activity).toHaveProperty('type');
        expect(activity).toHaveProperty('name');
        expect(activity).toHaveProperty('points');
      }
    });

    it('should return user data with name and avatar', async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);
      
      const activities = await caller.htb.getTeamActivity();
      
      if (activities.length > 0) {
        const activity = activities[0];
        expect(activity.user).toHaveProperty('name');
        expect(activity.user).toHaveProperty('avatar_thumb');
        expect(typeof activity.user.name).toBe('string');
      }
    });
  });

  describe('htb.getChallengeCounts', () => {
    it('should return challenge counts by category', async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);
      
      const counts = await caller.htb.getChallengeCounts();
      
      expect(counts).toBeDefined();
      expect(Array.isArray(counts)).toBe(true);
      expect(counts.length).toBeGreaterThan(0);
    });

    it('should return objects with category and count properties', async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);
      
      const counts = await caller.htb.getChallengeCounts();
      
      counts.forEach((item: any) => {
        expect(item).toHaveProperty('category');
        expect(item).toHaveProperty('count');
        expect(typeof item.category).toBe('string');
        expect(typeof item.count).toBe('number');
      });
    });

    it('should include all expected categories', async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);
      
      const counts = await caller.htb.getChallengeCounts();
      const categories = counts.map((item: any) => item.category);
      
      const expectedCategories = ['OSINT', 'Mobile', 'Web', 'GamePwn', 'Reversing', 'AI/ML', 'Crypto', 'Hardware', 'Coding', 'Forensics', 'Blockchain'];
      expectedCategories.forEach((cat) => {
        expect(categories).toContain(cat);
      });
    });

    it('should have non-negative counts', async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);
      
      const counts = await caller.htb.getChallengeCounts();
      
      counts.forEach((item: any) => {
        expect(item.count).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('htb.getLatestPwns', () => {
    it('should return latest pwns', async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);
      
      const pwns = await caller.htb.getLatestPwns();
      
      expect(pwns).toBeDefined();
      expect(Array.isArray(pwns)).toBe(true);
    });

    it('should return at most 3 pwns', async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);
      
      const pwns = await caller.htb.getLatestPwns();
      
      expect(pwns.length).toBeLessThanOrEqual(3);
    });

    it('should return pwn objects with required fields', async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);
      
      const pwns = await caller.htb.getLatestPwns();
      
      pwns.forEach((pwn: any) => {
        expect(pwn).toHaveProperty('username');
        expect(pwn).toHaveProperty('challengeName');
        expect(pwn).toHaveProperty('category');
        expect(pwn).toHaveProperty('date');
        expect(pwn).toHaveProperty('points');
      });
    });

    it('should have valid data types for pwn fields', async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);
      
      const pwns = await caller.htb.getLatestPwns();
      
      pwns.forEach((pwn: any) => {
        expect(typeof pwn.username).toBe('string');
        expect(typeof pwn.challengeName).toBe('string');
        expect(typeof pwn.category).toBe('string');
        expect(typeof pwn.date).toBe('string');
        expect(typeof pwn.points).toBe('number');
      });
    });

    it('should have valid category values', async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);
      
      const pwns = await caller.htb.getLatestPwns();
      const validCategories = ['OSINT', 'Mobile', 'Web', 'GamePwn', 'Reversing', 'AI/ML', 'Crypto', 'Hardware', 'Coding', 'Forensics', 'Blockchain'];
      
      pwns.forEach((pwn: any) => {
        expect(validCategories).toContain(pwn.category);
      });
    });
  });
});
