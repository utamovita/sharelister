import { updateUserLanguageSchema, updateUserSchema } from '@repo/schemas';

import { protectedProcedure, router } from '../trpc/trpc';
import { AccountService } from './account.service';

export const createAccountRouter = (accountService: AccountService) => {
  return router({
    getProfile: protectedProcedure.query(({ ctx }) => {
      const { passwordHash, refreshTokenHash, ...userProfile } = ctx.user;

      return userProfile;
    }),

    updateProfile: protectedProcedure
      .input(updateUserSchema)
      .mutation(({ ctx, input }) => {
        return accountService.updateProfile(ctx.user.id, input);
      }),

    deleteAccount: protectedProcedure.mutation(({ ctx }) => {
      return accountService.deleteAccount(ctx.user.id);
    }),

    updateLanguage: protectedProcedure
      .input(updateUserLanguageSchema)
      .mutation(({ ctx, input }) => {
        return accountService.updateLanguage(ctx.user.id, input);
      }),
  });
};
