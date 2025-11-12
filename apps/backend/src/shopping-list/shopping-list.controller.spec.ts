import { Test, TestingModule } from '@nestjs/testing';
import { createMockUser } from 'src/test-utils/mocks';

import { GroupMemberGuard } from '../auth/guard/guard-member.guard';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { ShoppingListController } from './shopping-list.controller';
import { ShoppingListService } from './shopping-list.service';

describe('ShoppingListController', () => {
  let controller: ShoppingListController;
  let service: ShoppingListService;

  const mockShoppingListService = {
    getItems: jest.fn(),
    addItem: jest.fn(),
    removeItems: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShoppingListController],
      providers: [
        {
          provide: ShoppingListService,
          useValue: mockShoppingListService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(GroupMemberGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<ShoppingListController>(ShoppingListController);
    service = module.get<ShoppingListService>(ShoppingListService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  const mockItems = [
    {
      id: 'item-1',
      name: 'Milk',
      quantity: 1,
      order: 0,
      groupId: 'group-123',
      addedBy: 'user-123',
      completed: false,
      createdAt: new Date(),
    },
    {
      id: 'item-2',
      name: 'Bread',
      quantity: 1,
      order: 0,
      groupId: 'group-123',
      addedBy: 'user-123',
      completed: false,
      createdAt: new Date(),
    },
    {
      id: 'item-3',
      name: 'Cheese',
      quantity: 1,
      order: 0,
      groupId: 'group-123',
      addedBy: 'user-123',
      completed: false,
      createdAt: new Date(),
    },
  ];
  const mockUser = createMockUser({ id: 'user-123' });
  const mockRequest = { user: mockUser };
  const groupId = 'group-123';

  describe('getItems', () => {
    it('should call service.getItems with correct params and return items', async () => {
      mockShoppingListService.getItems.mockResolvedValue(mockItems);

      const result = await controller.getItems({ groupId });

      expect(service.getItems).toHaveBeenCalledWith(groupId);
      expect(result).toEqual({ success: true, data: mockItems });
    });
  });

  describe('addItem', () => {
    it('should call service.add-item with correct params and return the new item', async () => {
      const dto = { name: 'Bread', quantity: 1 };
      const newItem = { id: 'item-2', name: 'Bread' };
      mockShoppingListService.addItem.mockResolvedValue(newItem);

      const result = await controller.addItem({ groupId }, dto, mockRequest);

      expect(service.addItem).toHaveBeenCalledWith(groupId, dto, mockUser.id);
      expect(result).toEqual({ success: true, data: newItem });
    });
  });

  describe('removeItem', () => {
    it('should call service.remove-item with correct params', async () => {
      mockShoppingListService.removeItems.mockResolvedValue(undefined);
      const removeItemIds = mockItems.map((item) => item.id);
      await controller.removeItems(groupId, { itemIds: removeItemIds });

      expect(service.removeItems).toHaveBeenCalledWith(removeItemIds, groupId);
    });
  });
});
