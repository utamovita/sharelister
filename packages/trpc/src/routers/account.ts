import { updateUserLanguageSchema, updateUserSchema } from "@repo/schemas";
import { router } from "../trpc";

import type { IAccountService } from "../services";
import { protectedProcedure } from "../procedures";
import { SuccessResponse } from "@repo/types";

export const createAccountRouter = (accountService: IAccountService) => {
  return router({
    getProfile: protectedProcedure.query(({ ctx }) => {
      const { name, id } = ctx.user;

      const response: SuccessResponse<{ name: string | null; id: string }> = {
        success: true,
        data: { name, id },
        message: "",
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

        const response: SuccessResponse<{ name: string | null }> = {
          success: true,
          data: { name: updatedUser.name },
          message: "response:account.usernameUpdated",
        };

        return response;
      }),

    deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
      await accountService.deleteAccount(ctx.user.id);

      const response: SuccessResponse<null> = {
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

        const response: SuccessResponse<null> = {
          success: true,
          data: null,
          message: "response:account.langUpdated",
        };

        return response;
      }),
  });
};
