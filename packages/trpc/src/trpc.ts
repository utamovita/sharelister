import { initTRPC } from "@trpc/server";
import { PrismaClient, User } from "@repo/database";
import { ZodError } from "zod";

export interface TRPCContext {
  user: User | null;
  prisma: PrismaClient;
}

const t = initTRPC.context<TRPCContext>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;
