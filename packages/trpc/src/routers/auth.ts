import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "@repo/schemas";
import { router } from "../trpc";
import type { IAuthService } from "../services";
import { TrpcSuccessResponse } from "@repo/types";
import { z } from "zod";
import { AuthResponseType } from "@repo/schemas";
import { protectedProcedure, publicProcedure } from "../procedures";

export const createAuthRouter = (authService: IAuthService) => {
  return router({
    login: publicProcedure.input(loginSchema).mutation(async ({ input }) => {
      const tokens = await authService.login(input);

      const response: TrpcSuccessResponse<AuthResponseType> = {
        success: true,
        data: tokens,
        message: "response:success.login",
      };
      return response;
    }),

    register: publicProcedure
      .input(registerSchema)
      .mutation(async ({ input }) => {
        const result = await authService.register(input);

        const response: TrpcSuccessResponse<{ message: string }> = {
          success: true,
          data: result,
          message: "response:success.register",
        };
        return response;
      }),

    logout: protectedProcedure.mutation(async ({ ctx }) => {
      await authService.logout(ctx.user.id);

      const response: TrpcSuccessResponse<null> = {
        success: true,
        data: null,
        message: "response:auth.logout",
      };
      return response;
    }),

    refreshToken: publicProcedure
      .input(z.object({ refreshToken: z.string() }))
      .mutation(async ({ input }) => {
        const tokenPayload = JSON.parse(
          atob(input.refreshToken.split(".")[1] || "{}"),
        );
        const userId = tokenPayload.sub;

        if (!userId) {
          throw new Error("Invalid token structure");
        }

        const tokens = await authService.refreshToken(
          userId,
          input.refreshToken,
        );

        const response: TrpcSuccessResponse<AuthResponseType> = {
          success: true,
          data: tokens,
          message: "Token refreshed",
        };
        return response;
      }),

    verifyEmail: publicProcedure
      .input(z.object({ token: z.string() }))
      .query(async ({ input }) => {
        const tokens = await authService.verifyEmail(input.token);

        const response: TrpcSuccessResponse<AuthResponseType> = {
          success: true,
          data: tokens,
          message: "response:success.emailVerified",
        };
        return response;
      }),

    forgotPassword: publicProcedure
      .input(forgotPasswordSchema)
      .mutation(async ({ input }) => {
        await authService.sendPasswordResetLink(input.email);

        const response: TrpcSuccessResponse<null> = {
          success: true,
          data: null,
          message: "response:success.passwordResetLinkSent",
        };
        return response;
      }),

    resetPassword: publicProcedure
      .input(resetPasswordSchema)
      .mutation(async ({ input }) => {
        await authService.resetPassword(input.token, input.password);

        const response: TrpcSuccessResponse<null> = {
          success: true,
          data: null,
          message: "response:success.passwordReset",
        };
        return response;
      }),
  });
};
