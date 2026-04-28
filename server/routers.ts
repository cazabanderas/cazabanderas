import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { isTeamMember } from "./db";
import { teamAuthRouter } from "./routers/teamAuth";
import { adminRouter } from "./routers/admin";
import { resourcesRouter } from "./routers/resources";
import { writeupsRouter } from "./routers/writeups";
import { recruitmentRouter } from "./routers/recruitment";
import { htbRouter } from "./routers/htb";
import { leaderboardRouter } from "./routers/leaderboard";
import { challengesRouter } from "./routers/challenges";
import { invitationsRouter } from "./routers/invitations";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  teamAuth: teamAuthRouter,
  admin: adminRouter,
  resources: resourcesRouter,
  writeups: writeupsRouter,
  recruitment: recruitmentRouter,
  htb: htbRouter,
  leaderboard: leaderboardRouter,
  challenges: challengesRouter,
  invitations: invitationsRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    checkTeamMember: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.user) return { isTeamMember: false, user: null };
      const isMember = await isTeamMember(ctx.user.openId);
      return { isTeamMember: isMember, user: ctx.user };
    }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
