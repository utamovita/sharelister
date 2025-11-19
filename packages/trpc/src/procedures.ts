import { TRPCError } from "@trpc/server";
import { middleware, publicProcedure } from "./trpc";
import {
  groupAdminMiddleware,
  groupMemberMiddleware,
} from "./middlewares/group.middleware";

const isAuthenticated = middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "auth.error.notAuthenticated",
    });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export { publicProcedure };

export const protectedProcedure = publicProcedure.use(isAuthenticated);
export const groupProcedure = protectedProcedure.use(groupMemberMiddleware);
export const groupAdminProcedure = protectedProcedure.use(groupAdminMiddleware);
