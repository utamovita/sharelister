import { createAccountRouter } from "./routers/account";
import { publicProcedure, router } from "./trpc";

import type { IAccountService, IGroupsService } from "./services";
import { createGroupsRouter } from "./routers/groups";

export const createAppRouter = (services: {
  accountService: IAccountService;
  groupsService: IGroupsService;
}) => {
  return router({
    healthcheck: publicProcedure.query(() => "yay!"),
    account: createAccountRouter(services.accountService),
    groups: createGroupsRouter(services.groupsService),
  });
};

export type AppRouter = ReturnType<typeof createAppRouter>;
