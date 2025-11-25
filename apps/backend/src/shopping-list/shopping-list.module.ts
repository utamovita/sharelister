import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';

import { EventsModule } from '../events/event.module';
import { ShoppingListService } from './shopping-list.service';

@Module({
  imports: [PrismaModule, EventsModule],
  providers: [ShoppingListService],
  exports: [ShoppingListService],
})
export class ShoppingListModule {}
