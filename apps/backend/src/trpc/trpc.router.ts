import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as trpcExpress from '@trpc/server/adapters/express';

import { createAccountRouter } from '../account/account.router';
import { AccountService } from '../account/account.service';
import { PrismaService } from '../prisma/prisma.service';
import { publicProcedure, router } from './trpc';
import { createTRPCContext } from './trpc.context';

const createAppRouter = (accountService: AccountService) => {
  return router({
    healthcheck: publicProcedure.query(() => 'Yay! The server is healthy.'),
    account: createAccountRouter(accountService),
  });
};

export type AppRouter = ReturnType<typeof createAppRouter>;

@Injectable()
export class TrpcRouter implements OnModuleInit {
  public appRouter!: AppRouter;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly accountService: AccountService,
  ) {}

  onModuleInit() {
    this.appRouter = createAppRouter(this.accountService);
  }

  applyMiddleware(app: INestApplication) {
    app.use(
      `/trpc`,
      trpcExpress.createExpressMiddleware({
        router: this.appRouter,
        createContext: (opts) =>
          createTRPCContext(
            opts,
            this.prisma,
            this.jwtService,
            this.configService,
          ),
      }),
    );
  }
}
