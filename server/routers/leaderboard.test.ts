import { describe, it, expect } from 'vitest';
import { appRouter } from '../routers';
import type { TrpcContext } from '../_core/context';

function createPublicContext(): TrpcContext {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: 'https',
      headers: {},
    } as TrpcContext['req'],
    res: {} as TrpcContext['res'],
  };

  return ctx;
}

describe('Leaderboard Router', () => {
  it('should get leaderboard successfully', async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.leaderboard.getLeaderboard();
    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(Array.isArray(result.data)).toBe(true);
  });

  it('should get leaderboard stats', async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.leaderboard.getLeaderboardStats();
    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.data).toHaveProperty('totalMembers');
    expect(result.data).toHaveProperty('averageFlags');
    expect(result.data).toHaveProperty('averagePoints');
  });

  it('should get top members with default limit', async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.leaderboard.getTopMembers({ limit: 10 });
    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.data.length).toBeLessThanOrEqual(10);
  });

  it('should get members by tier', async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.leaderboard.getMembersByTier({ tier: 'bronze' });
    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(Array.isArray(result.data)).toBe(true);
    // All returned members should have bronze tier
    result.data.forEach(member => {
      expect(member.tier).toBe('bronze');
    });
  });

  it('should handle invalid member ID gracefully', async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.leaderboard.getMemberStats({ memberId: 'invalid' });
    expect(result).toBeDefined();
    expect(result.success).toBe(false);
  });
});
