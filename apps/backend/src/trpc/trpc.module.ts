import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AccountModule } from '../account/account.module';
import { PrismaModule } from '../prisma/prisma.module';
import { TrpcController } from './trpc.controller';
import { TrpcService } from './trpc.service';

@Module({
  imports: [PrismaModule, AccountModule, JwtModule.register({}), ConfigModule],
  controllers: [TrpcController],
  providers: [TrpcService],
  exports: [TrpcService],
})
export class TrpcModule {}
