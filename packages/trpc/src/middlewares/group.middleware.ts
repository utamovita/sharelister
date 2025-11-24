import { TRPCError } from "@trpc/server";
import { ROLES } from "@repo/types";
import { middleware } from "../trpc";
import { groupParamsSchema } from "@repo/schemas";

const groupInputSchema = groupParamsSchema.loose();

export const groupMemberMiddleware = middleware(
  async ({ ctx, next, getRawInput }) => {
    const rawInput = await getRawInput();
    const result = groupInputSchema.safeParse(rawInput);

    if (!result.success) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Middleware usage error: Input must contain 'groupId'",
      });
    }

    const { groupId } = result.data;

    if (!ctx.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "auth.error.notAuthenticated",
      });
    }

    const membership = await ctx.prisma.groupMembership.findUnique({
      where: {
        userId_groupId: {
          userId: ctx.user.id,
          groupId: groupId,
        },
      },
    });

    if (!membership) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "group.notAMember",
      });
    }

    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
        membership,
      },
    });
  },
);

export const groupAdminMiddleware = groupMemberMiddleware.unstable_pipe(
  async ({ ctx, next }) => {
    if (ctx.membership.role !== ROLES.ADMIN) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "error.insufficientPermissions",
      });
    }

    return next({
      ctx: {
        ...ctx,
        isAdmin: true,
      },
    });
  },
);
