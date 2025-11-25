import { createAccountRouter } from "./routers/account";
import { publicProcedure, router } from "./trpc";

import type {
  IAccountService,
  IAuthService,
  IGroupsService,
  IInvitationsService,
  IShoppingListService,
} from "./services";
import { createGroupsRouter } from "./routers/groups";
import { createInvitationsRouter } from "./routers/invitations";
import { createShoppingListRouter } from "./routers/shopping-list";
import { createAuthRouter } from "./routers/auth";

export const createAppRouter = (services: {
  authService: IAuthService;
  accountService: IAccountService;
  groupsService: IGroupsService;
  invitationsService: IInvitationsService;
  shoppingListService: IShoppingListService;
}) => {
  return router({
    healthcheck: publicProcedure.query(() => "yay!"),
    auth: createAuthRouter(services.authService),
    account: createAccountRouter(services.accountService),
    groups: createGroupsRouter(services.groupsService),
    invitations: createInvitationsRouter(services.invitationsService),
    shoppingList: createShoppingListRouter(services.shoppingListService),
  });
};

export type AppRouter = ReturnType<typeof createAppRouter>;
