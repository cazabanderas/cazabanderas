import { router, protectedProcedure, adminProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { teamInvitations, invitationUses } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { TRPCError } from "@trpc/server";

export const invitationsRouter = router({
  /**
   * Generate a new shareable invitation link
   * Only admins can create invitations
   */
  create: adminProcedure
    .input(
      z.object({
        maxUses: z.number().int().min(0).default(0),
        expiresAt: z.date().optional(),
        message: z.string().max(500).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      
      const token = uuidv4();

      await db.insert(teamInvitations).values({
        token,
        createdBy: ctx.user.id,
        maxUses: input.maxUses,
        expiresAt: input.expiresAt,
        message: input.message,
        isActive: 1,
      });

      return {
        token,
        invitationUrl: `${process.env.VITE_FRONTEND_URL || "http://localhost:3000"}/join?token=${token}`,
      };
    }),

  /**
   * Get all active invitations (admin only)
   */
  getAll: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
    
    const invites = await db
      .select()
      .from(teamInvitations)
      .where(eq(teamInvitations.isActive, 1));

    return invites.map((invite: typeof teamInvitations.$inferSelect) => ({
      ...invite,
      invitationUrl: `${process.env.VITE_FRONTEND_URL || "http://localhost:3000"}/join?token=${invite.token}`,
      isExpired: invite.expiresAt ? new Date(invite.expiresAt) < new Date() : false,
      canUse: invite.maxUses === 0 || invite.usedCount < invite.maxUses,
    }));
  }),

  /**
   * Get invitation details by token (public)
   */
  getByToken: protectedProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      
      const invite = await db
        .select()
        .from(teamInvitations)
        .where(
          and(
            eq(teamInvitations.token, input.token),
            eq(teamInvitations.isActive, 1)
          )
        )
        .then((rows: typeof teamInvitations.$inferSelect[]) => rows[0]);

      if (!invite) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invitation not found or expired",
        });
      }

      const isExpired = invite.expiresAt
        ? new Date(invite.expiresAt) < new Date()
        : false;
      const canUse =
        !isExpired && (invite.maxUses === 0 || invite.usedCount < invite.maxUses);

      return {
        ...invite,
        isExpired,
        canUse,
        message: invite.message,
      };
    }),

  /**
   * Use an invitation (record the usage)
   */
  use: protectedProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      
      const invite = await db
        .select()
        .from(teamInvitations)
        .where(
          and(
            eq(teamInvitations.token, input.token),
            eq(teamInvitations.isActive, 1)
          )
        )
        .then((rows: typeof teamInvitations.$inferSelect[]) => rows[0]);

      if (!invite) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invitation not found or expired",
        });
      }

      const isExpired = invite.expiresAt
        ? new Date(invite.expiresAt) < new Date()
        : false;
      const canUse =
        !isExpired && (invite.maxUses === 0 || invite.usedCount < invite.maxUses);

      if (!canUse) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This invitation has expired or reached its usage limit",
        });
      }

      // Record the usage
      await db.insert(invitationUses).values({
        invitationId: invite.id,
        usedByOpenId: ctx.user.openId,
        usedByEmail: ctx.user.email,
        wasConverted: 0,
      });

      // Increment the used count
      await db
        .update(teamInvitations)
        .set({
          usedCount: invite.usedCount + 1,
        })
        .where(eq(teamInvitations.id, invite.id));

      return { success: true };
    }),

  /**
   * Deactivate an invitation
   */
  deactivate: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      
      await db
        .update(teamInvitations)
        .set({ isActive: 0 })
        .where(eq(teamInvitations.id, input.id));

      return { success: true };
    }),

  /**
   * Get usage history for an invitation
   */
  getUsageHistory: adminProcedure
    .input(z.object({ invitationId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      
      const uses = await db
        .select()
        .from(invitationUses)
        .where(eq(invitationUses.invitationId, input.invitationId));

      return uses;
    }),
});
