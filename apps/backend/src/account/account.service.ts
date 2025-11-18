import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateUserDto } from '@repo/schemas';
import type { IAccountService } from '@repo/trpc/services';
import { ROLES } from '@repo/types';
import { PrismaService } from 'src/prisma/prisma.service';

import { ChangeLangDto } from './dto';

@Injectable()
export class AccountService implements IAccountService {
  constructor(private prisma: PrismaService) {}

  async updateProfile(userId: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        name: updateUserDto.username,
      },
    });
  }

  async deleteAccount(userId: string): Promise<void> {
    try {
      await this.prisma.$transaction(async (tx) => {
        const memberships = await tx.groupMembership.findMany({
          where: { userId },
          select: { groupId: true, role: true },
        });

        const groupsToDelete = new Set<string>();

        for (const membership of memberships) {
          const { groupId, role } = membership;

          const groupMembers = await tx.groupMembership.findMany({
            where: { groupId },
          });

          if (groupMembers.length === 1) {
            groupsToDelete.add(groupId);
            continue;
          }

          if (role === ROLES.ADMIN) {
            const adminCount = groupMembers.filter(
              (m) => m.role === ROLES.ADMIN,
            ).length;

            if (adminCount === 1) {
              const nextMember = groupMembers.find((m) => m.userId !== userId);
              if (nextMember) {
                await tx.groupMembership.update({
                  where: {
                    userId_groupId: {
                      userId: nextMember.userId,
                      groupId,
                    },
                  },
                  data: { role: ROLES.ADMIN },
                });
              }
            }
          }
          await tx.groupMembership.delete({
            where: { userId_groupId: { userId, groupId } },
          });
        }

        if (groupsToDelete.size > 0) {
          await tx.group.deleteMany({
            where: { id: { in: Array.from(groupsToDelete) } },
          });
        }

        await tx.user.delete({
          where: { id: userId },
        });
      });
    } catch (error) {
      console.error(`Failed to delete account for user ${userId}:`, error);
      throw new InternalServerErrorException('Could not delete account.');
    }
  }

  async updateLanguage(userId: string, data: ChangeLangDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        lang: data.lang,
      },
    });
  }
}
