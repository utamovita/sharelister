import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { createMockGroup, createMockUser } from 'src/test-utils/mocks';

import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';

describe('GroupsController', () => {
  let controller: GroupsController;
  let service: GroupsService;

  const mockGroupsService = {
    create: jest.fn(),
    findAllForUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupsController],
      providers: [
        {
          provide: GroupsService,
          useValue: mockGroupsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<GroupsController>(GroupsController);
    service = module.get<GroupsService>(GroupsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return a success response (happy path)', async () => {
      const dto = { name: 'Test Group' };
      const mockUser = createMockUser({ id: 'user-123' });
      const mockRequest = { user: mockUser };
      const expectedGroup = createMockGroup({ name: dto.name });
      mockGroupsService.create.mockResolvedValue(expectedGroup);

      const result = await controller.create(dto, mockRequest);

      expect(service.create).toHaveBeenCalledWith(dto, mockUser.id);
      expect(result).toEqual({ success: true, data: expectedGroup });
    });

    it('should propagate exceptions from the service (sad path)', async () => {
      const dto = { name: 'Test Group' };
      const mockUser = createMockUser({ id: 'user-123' });
      const mockRequest = { user: mockUser };
      mockGroupsService.create.mockRejectedValue(new BadRequestException());

      await expect(controller.create(dto, mockRequest)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
