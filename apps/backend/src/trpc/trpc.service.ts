import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { type TRPCContext } from '@repo/trpc';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';

import { PrismaService } from '../prisma/prisma.service';
import { createTRPCContext } from './trpc.context';
import { TrpcRouter } from './trpc.router';

@Injectable()
export class TrpcService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    public readonly trpcRouter: TrpcRouter,
  ) {}

  createContext = async (
    opts: CreateExpressContextOptions,
  ): Promise<TRPCContext> => {
    return createTRPCContext(
      opts,
      this.prisma,
      this.jwtService,
      this.configService,
    );
  };
}
