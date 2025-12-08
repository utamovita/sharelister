import { Injectable } from '@nestjs/common';
import { Group, GroupMembership } from '@repo/database';
import {
  CreateGroupDto,
  UpdateGroupDto,
  UpdateMemberRoleDto,
} from '@repo/schemas';
import { IGroupsService } from '@repo/trpc/services';
import { GroupWithDetails, ROLES } from '@repo/types';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GroupsService implements IGroupsService {
  constructor(private prisma: PrismaService) {}

  async getGroups(userId: string) {
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

    const groupsWithDetails: GroupWithDetails[] = groups.map((group) => {
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

    return groupsWithDetails;
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

  async updateName(
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
    // TODO: Remove the group and items inside if the last member is removed

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
    //TODO: Prevent demoting last admin

    return this.prisma.groupMembership.update({
      where: {
        userId_groupId: { userId: memberId, groupId },
      },
      data: { role: updateDto.role },
    });
  }
}
