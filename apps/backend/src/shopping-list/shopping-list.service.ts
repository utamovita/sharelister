import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENT_NAME } from '@repo/config';
import { PrismaService } from 'src/prisma/prisma.service';

import {
  CreateShoppingListItemDto,
  UpdateShoppingListItemDto,
} from './dto/shopping-list-item.dto';

@Injectable()
export class ShoppingListService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async getItems(groupId: string) {
    return this.prisma.shoppingListItem.findMany({
      where: {
        groupId,
      },
      orderBy: {
        order: 'asc',
      },
    });
  }

  async addItem(
    groupId: string,
    createShoppingListItemDto: CreateShoppingListItemDto,
    userId: string,
  ) {
    const maxOrderResult = await this.prisma.shoppingListItem.aggregate({
      _max: {
        order: true,
      },
      where: {
        groupId,
      },
    });

    const lastOrder = maxOrderResult._max.order;
    const newOrder = (lastOrder ?? -1) + 1;

    const newItem = await this.prisma.shoppingListItem.create({
      data: {
        name: createShoppingListItemDto.name,
        quantity: createShoppingListItemDto.quantity,
        groupId,
        addedBy: userId,
        order: newOrder,
      },
    });

    this.eventEmitter.emit(EVENT_NAME.shoppingListUpdated, groupId);
    return newItem;
  }

  async reorderItems(
    groupId: string,
    orderedItems: { id: string; order: number }[],
  ) {
    const updates = orderedItems.map((item) =>
      this.prisma.shoppingListItem.update({
        where: { id: item.id, groupId: groupId },
        data: { order: item.order },
      }),
    );

    await this.prisma.$transaction(updates);

    this.eventEmitter.emit(EVENT_NAME.shoppingListUpdated, groupId);

    return { success: true };
  }

  async removeItems(itemIds: string[], groupId: string) {
    const result = await this.prisma.shoppingListItem.deleteMany({
      where: {
        id: {
          in: itemIds,
        },
        groupId: groupId,
      },
    });

    if (result.count > 0) {
      this.eventEmitter.emit(EVENT_NAME.shoppingListUpdated, groupId);
    }
    return result;
  }
  async updateItem(
    itemId: string,
    groupId: string,
    updateDto: UpdateShoppingListItemDto,
  ) {
    const dataToUpdate = {
      ...(updateDto.name !== undefined && { name: updateDto.name }),
      ...(updateDto.quantity !== undefined && {
        quantity: updateDto.quantity,
      }),
      ...(updateDto.completed !== undefined && {
        completed: updateDto.completed,
      }),
    };

    const updatedItem = await this.prisma.shoppingListItem.update({
      where: { id: itemId, groupId: groupId },
      data: dataToUpdate,
    });

    this.eventEmitter.emit(EVENT_NAME.shoppingListUpdated, groupId);
    return updatedItem;
  }
}
