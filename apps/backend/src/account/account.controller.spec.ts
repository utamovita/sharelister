import { Test, TestingModule } from '@nestjs/testing';
import { UpdateUserDto } from '@repo/schemas';
import { UserProfile } from '@repo/types';

import { createMockUser } from '../test-utils/mocks';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

describe('AccountController', () => {
  let controller: AccountController;
  let service: AccountService;

  const mockAccountService = {
    updateProfile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        {
          provide: AccountService,
          useValue: mockAccountService,
        },
      ],
    }).compile();

    controller = module.get<AccountController>(AccountController);
    service = module.get<AccountService>(AccountService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return the user object from the request', () => {
      const mockUser = createMockUser();
      const mockRequest = { user: mockUser as UserProfile };

      const result = controller.getProfile(mockRequest);

      expect(result).toEqual({ success: true, data: mockUser });
    });
  });

  describe('updateProfile', () => {
    it('should call service.updateProfile and return updated user', async () => {
      const mockUser = createMockUser();
      const mockRequest = { user: mockUser as UserProfile };
      const updateUserDto: UpdateUserDto = { username: 'NewName' };
      const updatedUser = { ...mockUser, name: 'NewName' };

      mockAccountService.updateProfile.mockResolvedValue(updatedUser);

      const result = await controller.updateProfile(mockRequest, updateUserDto);

      expect(service.updateProfile).toHaveBeenCalledWith(
        mockUser.id,
        updateUserDto,
      );

      const { name } = updatedUser;

      expect(result).toEqual({
        success: true,
        data: name,
        message: 'success.profileUpdated',
      });
    });
  });
});
