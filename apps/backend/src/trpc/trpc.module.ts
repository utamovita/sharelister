import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AccountModule } from '../account/account.module';
import { GroupsModule } from '../groups/groups.module';
import { PrismaModule } from '../prisma/prisma.module';
import { TrpcController } from './trpc.controller';
import { TrpcRouter } from './trpc.router';
import { TrpcService } from './trpc.service';

@Module({
  imports: [
    PrismaModule,
    AccountModule,
    GroupsModule,
    JwtModule.register({}),
    ConfigModule,
  ],
  controllers: [TrpcController],
  providers: [TrpcService, TrpcRouter],
  exports: [TrpcService, TrpcRouter],
})
export class TrpcModule {}
