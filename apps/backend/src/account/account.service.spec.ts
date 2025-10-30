import { Test, TestingModule } from '@nestjs/testing';
import { UpdateUserDto } from '@repo/schemas';
import { PrismaService } from 'src/prisma/prisma.service';

import { createMockUser } from '../test-utils/mocks';
import { AccountService } from './account.service';

describe('AccountService', () => {
  let service: AccountService;
  let prisma: PrismaService;

  // Tworzymy atrapę PrismaService
  const mockPrismaService = {
    user: {
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        // Dostarczamy mocka zamiast prawdziwego PrismaService
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateProfile', () => {
    it('should call prisma.user.update with correct parameters and return the updated user', async () => {
      const userId = 'user-123';
      const updateUserDto: UpdateUserDto = { username: 'New Name' };
      const mockUpdatedUser = createMockUser({
        id: userId,
        name: updateUserDto.username,
      });

      mockPrismaService.user.update.mockResolvedValue(mockUpdatedUser);

      const result = await service.updateProfile(userId, updateUserDto);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { name: updateUserDto.username },
      });

      expect(result).toEqual(mockUpdatedUser);
    });
  });
});
