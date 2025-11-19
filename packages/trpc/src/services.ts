import type { User } from "@repo/database";
import type {
  CreateGroupDto,
  UpdateGroupDto,
  UpdateUserDto,
  UpdateUserLanguageDto,
} from "@repo/schemas";
import type { GroupWithDetails } from "@repo/types";
import type { Group, GroupMembership } from "@repo/database";
import { UpdateMemberRoleDto } from "@repo/schemas/src";

export interface IAccountService {
  updateProfile(userId: string, updateUserDto: UpdateUserDto): Promise<User>;
  deleteAccount(userId: string): Promise<void>;
  updateLanguage(userId: string, data: UpdateUserLanguageDto): Promise<User>;
}

export interface IGroupsService {
  findAllForUser(userId: string): Promise<GroupWithDetails[]>;
  create(createGroupDto: CreateGroupDto, userId: string): Promise<Group>;
  update(groupId: string, updateGroupDto: UpdateGroupDto): Promise<Group>;
  remove(groupId: string): Promise<void>;
  removeMember(groupId: string, memberId: string): Promise<void>;
  updateMemberRole(
    groupId: string,
    memberId: string,
    updateDto: UpdateMemberRoleDto,
  ): Promise<GroupMembership>;
}
