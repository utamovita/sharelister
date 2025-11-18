import { createAccountRouter } from "./routers/account";
import { publicProcedure, router } from "./trpc";

import type { IAccountService } from "./services";

export const createAppRouter = (services: {
  accountService: IAccountService;
}) => {
  return router({
    healthcheck: publicProcedure.query(() => "yay!"),
    account: createAccountRouter(services.accountService),
  });
};

export type AppRouter = ReturnType<typeof createAppRouter>;
