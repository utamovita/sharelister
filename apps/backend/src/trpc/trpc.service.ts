import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';

import { AccountService } from '../account/account.service';
import { PrismaService } from '../prisma/prisma.service';
import { AppRouter, createAppRouter } from './app.router';
import { createTRPCContext, TRCPContext } from './context';

@Injectable()
export class TrpcService implements OnModuleInit {
  appRouter!: AppRouter;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly accountService: AccountService,
  ) {}

  onModuleInit() {
    this.appRouter = createAppRouter(this.accountService);
  }

  createContext = async (
    opts: CreateExpressContextOptions,
  ): Promise<TRCPContext> => {
    return createTRPCContext(
      opts,
      this.prisma,
      this.jwtService,
      this.configService,
    );
  };
}
