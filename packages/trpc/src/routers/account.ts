import { updateUserLanguageSchema, updateUserSchema } from "@repo/schemas";
import { router } from "../trpc";

import type { IAccountService } from "../services";
import { protectedProcedure } from "../procedures";
import { TrpcSuccessResponse } from "@repo/types";

export const createAccountRouter = (accountService: IAccountService) => {
  return router({
    getProfile: protectedProcedure.query(({ ctx }) => {
      const { name, id } = ctx.user;

      const response: TrpcSuccessResponse<{ name: string | null; id: string }> =
        {
          success: true,
          data: { name, id },
          message: "response:account.profileFetched",
        };

      return response;
    }),

    updateProfile: protectedProcedure
      .input(updateUserSchema)
      .mutation(async ({ ctx, input }) => {
        const updatedUser = await accountService.updateUsername(
          ctx.user.id,
          input,
        );

        const response: TrpcSuccessResponse<{ name: string | null }> = {
          success: true,
          data: { name: updatedUser.name },
          message: "response:account.usernameUpdated",
        };

        return response;
      }),

    deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
      await accountService.deleteAccount(ctx.user.id);

      const response: TrpcSuccessResponse<null> = {
        success: true,
        data: null,
        message: "response:account.deleted",
      };

      return response;
    }),

    updateLanguage: protectedProcedure
      .input(updateUserLanguageSchema)
      .mutation(async ({ ctx, input }) => {
        await accountService.updateLanguage(ctx.user.id, input);

        const response: TrpcSuccessResponse<null> = {
          success: true,
          data: null,
          message: "response:account.langUpdated",
        };

        return response;
      }),
  });
};
