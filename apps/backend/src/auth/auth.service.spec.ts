import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { createMockUser } from 'src/test-utils/mocks';

import { MailService } from '../mail/mail.service';
import { AuthService } from './auth.service';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let mailService: MailService;
  let _jwt: JwtService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockMailService = {
    sendVerificationEmail: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
  };

  const mockConfigService = {
    getOrThrow: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: MailService, useValue: mockMailService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    mailService = module.get<MailService>(MailService);
    _jwt = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should create a user, send verification email, and return a message', async () => {
      const dto = {
        email: 'test@example.com',
        username: 'Test User',
        password: 'password123',
      };
      const hashedPassword = 'hashedPassword';
      const createdUser = createMockUser({
        id: '1',
        email: dto.email,
        name: dto.username,
      });

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockPrismaService.user.create.mockResolvedValue(createdUser);

      const result = await service.register(dto);

      expect(prisma.user.create).toHaveBeenCalled();
      expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
        dto.email,
        expect.any(String),
        expect.any(String),
      );
      expect(result).toEqual({ message: 'Verification email sent.' });
    });

    it('should throw a ConflictException if email already exists', async () => {
      const dto = {
        email: 'exists@example.com',
        username: 'Test',
        password: 'password123',
      };
      mockPrismaService.user.findUnique.mockResolvedValue(createMockUser());

      await expect(service.register(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should return tokens for valid credentials', async () => {
      const dto = { email: 'test@example.com', password: 'password123' };
      const user = createMockUser({
        passwordHash: 'hashedPassword',
        emailVerified: new Date(),
      });

      mockPrismaService.user.findUnique.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      mockJwtService.signAsync
        .mockResolvedValueOnce('test_access_token')
        .mockResolvedValueOnce('test_refresh_token');

      const result = await service.login(dto);

      expect(bcrypt.compare).toHaveBeenCalledWith(
        dto.password,
        user.passwordHash,
      );
      expect(result).toEqual({
        accessToken: 'test_access_token',
        refreshToken: 'test_refresh_token',
      });
    });

    it('should throw an UnauthorizedException for an incorrect password', async () => {
      const dto = {
        email: 'test@example.com',
        password: 'wrongpassword',
        emailVerified: new Date(),
      };
      const user = createMockUser({ passwordHash: 'hashedPassword' });

      mockPrismaService.user.findUnique.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
