import { createAccountRouter } from "./routers/account";
import { publicProcedure, router } from "./trpc";

import type {
  IAccountService,
  IGroupsService,
  IInvitationsService,
} from "./services";
import { createGroupsRouter } from "./routers/groups";
import { createInvitationsRouter } from "./routers/invitations";

export const createAppRouter = (services: {
  accountService: IAccountService;
  groupsService: IGroupsService;
  invitationsService: IInvitationsService;
}) => {
  return router({
    healthcheck: publicProcedure.query(() => "yay!"),
    account: createAccountRouter(services.accountService),
    groups: createGroupsRouter(services.groupsService),
    invitations: createInvitationsRouter(services.invitationsService),
  });
};

export type AppRouter = ReturnType<typeof createAppRouter>;
