import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from '@repo/schemas';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async updateProfile(userId: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        name: updateUserDto.username,
      },
    });
  }
}
