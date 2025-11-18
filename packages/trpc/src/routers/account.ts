import { updateUserLanguageSchema, updateUserSchema } from "@repo/schemas";
import { protectedProcedure, router } from "../trpc";

import type { IAccountService } from "../services";

export const createAccountRouter = (accountService: IAccountService) => {
  return router({
    getProfile: protectedProcedure.query(({ ctx }) => {
      const {
        passwordHash,
        refreshTokenHash,
        passwordResetToken,
        passwordResetExpires,
        verificationToken,
        ...userProfile
      } = ctx.user;
      return userProfile;
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
