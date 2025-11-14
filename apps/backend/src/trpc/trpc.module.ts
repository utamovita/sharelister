import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AccountModule } from '../account/account.module';
import { PrismaModule } from '../prisma/prisma.module';
import { TrpcRouter } from './trpc.router';

@Module({
  imports: [PrismaModule, AccountModule, JwtModule.register({}), ConfigModule],
  providers: [TrpcRouter],
  exports: [TrpcRouter],
})
export class TrpcModule {}
