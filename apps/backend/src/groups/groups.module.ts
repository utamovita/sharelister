import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';

import { GroupsService } from './groups.service';

@Module({
  imports: [PrismaModule],
  providers: [GroupsService],
  exports: [GroupsService],
})
export class GroupsModule {}
