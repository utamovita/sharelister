import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';

import { GroupAdminController } from './group-admin.controller';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';

@Module({
  imports: [PrismaModule],
  providers: [GroupsService],
  controllers: [GroupsController, GroupAdminController],
  exports: [GroupsService],
})
export class GroupsModule {}
