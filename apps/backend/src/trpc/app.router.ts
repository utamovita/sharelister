import { createAccountRouter } from '../account/account.router';
import { AccountService } from '../account/account.service';
import { publicProcedure, router } from './trpc';

export const createAppRouter = (accountService: AccountService) => {
  return router({
    healthcheck: publicProcedure.query(() => 'Yay! The server is healthy.'),
    account: createAccountRouter(accountService),
  });
};

export type AppRouter = ReturnType<typeof createAppRouter>;
