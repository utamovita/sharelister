import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { EVENT_NAME } from '@repo/config';
import { ShoppingListItem } from '@repo/database';
import { PrismaService } from 'src/prisma/prisma.service';

import { ShoppingListService } from './shopping-list.service';

describe('ShoppingListService', () => {
  let service: ShoppingListService;
  let prisma: PrismaService;
  let eventEmitter: EventEmitter2;

  const mockPrismaService = {
    shoppingListItem: {
      create: jest.fn(),
      findMany: jest.fn(),
      deleteMany: jest.fn(),
      aggregate: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest
      .fn()
      .mockImplementation((updates) => Promise.all(updates)),
  };

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShoppingListService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    service = module.get<ShoppingListService>(ShoppingListService);
    prisma = module.get<PrismaService>(PrismaService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const userId = 'user-123';
  const groupId = 'group-123';

  const mockItems = [
    {
      id: 'item-1',
      name: 'Milk',
      quantity: 1,
      groupId,
    },
  ] as const;

  describe('addItem', () => {
    it('should add an item and emit an event', async () => {
      const dto = { name: 'Milk', quantity: 1 };
      const expectedItem = {
        id: 'item-1',
        name: 'Milk',
        quantity: 1,
        groupId,
      } as ShoppingListItem;

      mockPrismaService.shoppingListItem.aggregate.mockResolvedValue({
        _max: { order: null },
      });
      mockPrismaService.shoppingListItem.create.mockResolvedValue(expectedItem);

      const result = await service.addItem(groupId, dto, userId);

      expect(prisma.shoppingListItem.create).toHaveBeenCalledWith({
        data: {
          name: dto.name,
          quantity: dto.quantity,
          groupId,
          addedBy: userId,
          order: 0,
        },
      });
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        EVENT_NAME.shoppingListUpdated,
        groupId,
      );
      expect(result).toEqual(expectedItem);
    });
  });

  describe('getItems', () => {
    it('should return items for a group', async () => {
      const expectedItems = [
        { id: 'item-1', name: 'Milk', groupId },
      ] as ShoppingListItem[];
      mockPrismaService.shoppingListItem.findMany.mockResolvedValue(
        expectedItems,
      );

      const result = await service.getItems(groupId);

      expect(prisma.shoppingListItem.findMany).toHaveBeenCalledWith({
        where: { groupId },
        orderBy: { order: 'asc' },
      });
      expect(result).toEqual(expectedItems);
    });
  });

  describe('removeItems', () => {
    it('should remove items and emit an event', async () => {
      mockPrismaService.shoppingListItem.deleteMany.mockResolvedValue({
        count: 1,
      });

      await service.removeItems([mockItems[0].id], groupId);

      expect(prisma.shoppingListItem.deleteMany).toHaveBeenCalledWith({
        where: {
          id: {
            in: [mockItems[0].id],
          },
          groupId,
        },
      });

      expect(eventEmitter.emit).toHaveBeenCalledWith(
        EVENT_NAME.shoppingListUpdated,
        groupId,
      );
    });
  });
});
