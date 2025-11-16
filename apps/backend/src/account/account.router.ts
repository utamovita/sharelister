import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { updateUserLanguageSchema, updateUserSchema } from '@repo/schemas';
import { TRPCError } from '@trpc/server';

import { protectedProcedure, router } from '../trpc/trpc';
import { AccountService } from './account.service';

const handleServiceError = (error: unknown) => {
  if (
    error instanceof NotFoundException ||
    error instanceof ConflictException ||
    error instanceof ForbiddenException ||
    error instanceof UnauthorizedException
  ) {
    const code =
      error.getStatus() === 401
        ? 'UNAUTHORIZED'
        : error.getStatus() === 403
          ? 'FORBIDDEN'
          : error.getStatus() === 404
            ? 'NOT_FOUND'
            : 'CONFLICT';

    throw new TRPCError({
      code: code,
      message: error.message,
      cause: error,
    });
  }

  throw new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred',
  });
};

export const createAccountRouter = (accountService: AccountService) => {
  return router({
    getProfile: protectedProcedure.query(({ ctx }) => {
      const { passwordHash, refreshTokenHash, ...userProfile } = ctx.user;
      return userProfile;
    }),

    updateProfile: protectedProcedure
      .input(updateUserSchema)
      .mutation(async ({ ctx, input }) => {
        try {
          return await accountService.updateProfile(ctx.user.id, input);
        } catch (error) {
          handleServiceError(error);
        }
      }),

    deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
      try {
        await accountService.deleteAccount(ctx.user.id);
        return;
      } catch (error) {
        handleServiceError(error);
      }
    }),

    updateLanguage: protectedProcedure
      .input(updateUserLanguageSchema)
      .mutation(async ({ ctx, input }) => {
        try {
          return await accountService.updateLanguage(ctx.user.id, input);
        } catch (error) {
          handleServiceError(error);
        }
      }),
  });
};
