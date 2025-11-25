import type {
  CreateGroupDto,
  CreateInvitationDto,
  UpdateGroupDto,
  UpdateUserDto,
  UpdateUserLanguageDto,
  UpdateMemberRoleDto,
  CreateShoppingListItemDto,
  UpdateShoppingListItemDto,
  ShoppingListItem,
  RemoveShoppingListItemsDto,
  ReorderShoppingListDto,
} from "@repo/schemas";
import type { GroupWithDetails, Invitation } from "@repo/types";
import type { User, Group, GroupMembership } from "@repo/database";

export interface IAccountService {
  updateUsername(userId: string, updateUserDto: UpdateUserDto): Promise<User>;
  deleteAccount(userId: string): Promise<void>;
  updateLanguage(userId: string, data: UpdateUserLanguageDto): Promise<User>;
}

export interface IGroupsService {
  getGroups(userId: string): Promise<GroupWithDetails[]>;
  create(createGroupDto: CreateGroupDto, userId: string): Promise<Group>;
  updateName(groupId: string, updateGroupDto: UpdateGroupDto): Promise<Group>;
  remove(groupId: string): Promise<void>;
  removeMember(groupId: string, memberId: string): Promise<void>;
  updateMemberRole(
    groupId: string,
    memberId: string,
    updateDto: UpdateMemberRoleDto,
  ): Promise<GroupMembership>;
}

export interface IInvitationsService {
  create(
    groupId: string,
    invitingUserId: string,
    createInvitationDto: CreateInvitationDto,
  ): Promise<Invitation>;
  findAllReceivedForUser(userId: string): Promise<Invitation[]>;
  accept(invitationId: string, userId: string): Promise<void>;
  decline(invitationId: string, userId: string): Promise<void>;
}

export interface IShoppingListService {
  getItems(groupId: string): Promise<ShoppingListItem[]>;
  addItem(
    groupId: string,
    dto: CreateShoppingListItemDto,
    userId: string,
  ): Promise<ShoppingListItem>;
  updateItem(dto: UpdateShoppingListItemDto): Promise<ShoppingListItem>;
  removeItems(dto: RemoveShoppingListItemsDto): Promise<void>;
  reorderItems(dto: ReorderShoppingListDto): Promise<void>;
}
