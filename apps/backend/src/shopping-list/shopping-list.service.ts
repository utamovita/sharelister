import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENT_NAME } from '@repo/config';
import {
  CreateShoppingListItemDto,
  RemoveShoppingListItemsDto,
  ReorderShoppingListDto,
  UpdateShoppingListItemDto,
} from '@repo/schemas';
import { ShoppingListItem } from '@repo/schemas';
import { IShoppingListService } from '@repo/trpc/services';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ShoppingListService implements IShoppingListService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async getItems(groupId: string) {
    const result = await this.prisma.shoppingListItem.findMany({
      where: {
        groupId,
      },
      orderBy: {
        order: 'asc',
      },
    });

    const items: ShoppingListItem[] = result.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      completed: item.completed,
      order: item.order,
      groupId: item.groupId,
    }));

    return items;
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

    const result = await this.prisma.shoppingListItem.create({
      data: {
        name: createShoppingListItemDto.name,
        quantity: createShoppingListItemDto.quantity,
        groupId,
        addedBy: userId,
        order: newOrder,
      },
    });

    this.eventEmitter.emit(EVENT_NAME.shoppingListUpdated, groupId);

    const newItem: ShoppingListItem = {
      id: result.id,
      name: result.name,
      quantity: result.quantity,
      completed: result.completed,
      order: result.order,
      groupId: result.groupId,
    };

    return newItem;
  }

  async reorderItems(dto: ReorderShoppingListDto) {
    const { groupId, items } = dto;

    const updates = items.map((item) =>
      this.prisma.shoppingListItem.update({
        where: { id: item.id, groupId: groupId },
        data: { order: item.order },
      }),
    );

    await this.prisma.$transaction(updates);
    this.eventEmitter.emit(EVENT_NAME.shoppingListUpdated, groupId);
  }

  async removeItems(dto: RemoveShoppingListItemsDto) {
    const result = await this.prisma.shoppingListItem.deleteMany({
      where: {
        id: {
          in: dto.itemIds,
        },
        groupId: dto.groupId,
      },
    });

    if (result.count > 0) {
      this.eventEmitter.emit(EVENT_NAME.shoppingListUpdated, dto.groupId);
    }
  }
  async updateItem({
    id,
    groupId,
    name,
    quantity,
    completed,
  }: UpdateShoppingListItemDto) {
    const updatedItem = await this.prisma.shoppingListItem.update({
      where: { id, groupId },
      data: {
        name,
        quantity,
        completed,
      },
    });

    this.eventEmitter.emit(EVENT_NAME.shoppingListUpdated, groupId);
    return updatedItem;
  }
}
