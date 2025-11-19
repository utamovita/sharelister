import { updateUserLanguageSchema, updateUserSchema } from "@repo/schemas";
import { router } from "../trpc";

import type { IAccountService } from "../services";
import { protectedProcedure } from "../procedures";

export const createAccountRouter = (accountService: IAccountService) => {
  return router({
    getProfile: protectedProcedure.query(({ ctx }) => {
      const { name, id } = ctx.user;

      return { name, id };
    }),

    updateProfile: protectedProcedure
      .input(updateUserSchema)
      .mutation(async ({ ctx, input }) => {
        const updatedUser = await accountService.updateProfile(
          ctx.user.id,
          input,
        );
        return { name: updatedUser.name };
      }),

    deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
      await accountService.deleteAccount(ctx.user.id);
      return { success: true };
    }),

    updateLanguage: protectedProcedure
      .input(updateUserLanguageSchema)
      .mutation(async ({ ctx, input }) => {
        await accountService.updateLanguage(ctx.user.id, input);
        return { success: true };
      }),
  });
};
