import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { authenticateTeamMember } from "../db";
import { TRPCError } from "@trpc/server";

export const teamAuthRouter = router({
  /**
   * Login with username and password
   * Returns team member info on success
   */
  login: publicProcedure
    .input(
      z.object({
        username: z.string().min(1, "Username is required"),
        password: z.string().min(1, "Password is required"),
      })
    )
    .mutation(async ({ input }) => {
      const member = await authenticateTeamMember(input.username, input.password);

      if (!member) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid username or password",
        });
      }

      return {
        success: true,
        member: {
          id: member.id,
          displayName: member.displayName,
          specialty: member.specialty,
          openId: member.openId,
        },
      };
    }),

  /**
   * Logout (clears session on client side)
   */
  logout: publicProcedure.mutation(() => {
    return { success: true };
  }),
});
