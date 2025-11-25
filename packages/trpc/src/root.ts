import { createAccountRouter } from "./routers/account";
import { publicProcedure, router } from "./trpc";

import type {
  IAccountService,
  IGroupsService,
  IInvitationsService,
  IShoppingListService,
} from "./services";
import { createGroupsRouter } from "./routers/groups";
import { createInvitationsRouter } from "./routers/invitations";
import { createShoppingListRouter } from "./routers/shopping-list";

export const createAppRouter = (services: {
  accountService: IAccountService;
  groupsService: IGroupsService;
  invitationsService: IInvitationsService;
  shoppingListService: IShoppingListService;
}) => {
  return router({
    healthcheck: publicProcedure.query(() => "yay!"),
    account: createAccountRouter(services.accountService),
    groups: createGroupsRouter(services.groupsService),
    invitations: createInvitationsRouter(services.invitationsService),
    shoppingList: createShoppingListRouter(services.shoppingListService),
  });
};

export type AppRouter = ReturnType<typeof createAppRouter>;
