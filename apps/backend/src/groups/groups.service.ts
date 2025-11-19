import { ForbiddenException, Injectable } from '@nestjs/common';
import { Group, GroupMembership } from '@repo/database';
import { IGroupsService } from '@repo/trpc/services';
import { GroupWithDetails, ROLES } from '@repo/types';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';

@Injectable()
export class GroupsService implements IGroupsService {
  constructor(private prisma: PrismaService) {}

  async findAllForUser(userId: string) {
    const groups = await this.prisma.group.findMany({
      where: {
        members: {
          some: { userId },
        },
      },

      select: {
        id: true,
        name: true,
        members: {
          select: {
            userId: true,
            role: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: { shoppingItems: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const groupWithDetails: GroupWithDetails[] = groups.map((group) => {
      const currentUserMembership = group.members.find(
        (m) => m.userId === userId,
      );

      return {
        id: group.id,
        name: group.name,
        itemCount: group._count.shoppingItems,
        currentUserRole: currentUserMembership?.role || ROLES.USER,
        members: group.members.map((m) => ({
          user: {
            id: m.user.id,
            name: m.user.name,
          },
          role: m.role,
        })),
      };
    });

    return groupWithDetails;
  }

  async create(createGroupDto: CreateGroupDto, userId: string): Promise<Group> {
    const { name } = createGroupDto;

    return this.prisma.$transaction(async (tx) => {
      const group = await tx.group.create({
        data: { name },
      });

      await tx.groupMembership.create({
        data: {
          userId,
          groupId: group.id,
          role: ROLES.ADMIN,
        },
      });

      return group;
    });
  }

  async update(
    groupId: string,
    updateGroupDto: UpdateGroupDto,
  ): Promise<Group> {
    return this.prisma.group.update({
      where: { id: groupId },
      data: { name: updateGroupDto.name },
    });
  }

  async remove(groupId: string): Promise<void> {
    await this.prisma.group.delete({
      where: { id: groupId },
    });
  }

  async removeMember(groupId: string, memberId: string): Promise<void> {
    const memberCount = await this.prisma.groupMembership.count({
      where: { groupId },
    });

    if (memberCount <= 1) {
      throw new ForbiddenException(
        'You cannot remove the last member of a group. Delete the group instead.',
      );
    }

    await this.prisma.groupMembership.delete({
      where: {
        userId_groupId: {
          userId: memberId,
          groupId: groupId,
        },
      },
    });
  }

  async updateMemberRole(
    groupId: string,
    memberId: string,
    updateDto: UpdateMemberRoleDto,
  ): Promise<GroupMembership> {
    if (updateDto.role === ROLES.USER) {
      const membership = await this.prisma.groupMembership.findUnique({
        where: {
          userId_groupId: { userId: memberId, groupId },
        },
      });

      if (membership?.role === ROLES.ADMIN) {
        const adminCount = await this.prisma.groupMembership.count({
          where: { groupId, role: ROLES.ADMIN },
        });

        if (adminCount <= 1) {
          throw new ForbiddenException(
            'Cannot remove the last admin from the group.',
          );
        }
      }
    }

    return this.prisma.groupMembership.update({
      where: {
        userId_groupId: { userId: memberId, groupId },
      },
      data: { role: updateDto.role },
    });
  }
}
