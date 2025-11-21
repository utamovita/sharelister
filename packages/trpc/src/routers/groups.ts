import {
  createGroupSchema,
  groupParamsSchema,
  memberParamsSchema,
  updateGroupInputSchema,
  updateMemberRoleInputSchema,
} from "@repo/schemas";
import { router } from "../trpc";
import type { IGroupsService } from "../services";
import { groupAdminProcedure, protectedProcedure } from "../procedures";
import { GroupWithDetails, TrpcSuccessResponse } from "@repo/types";

export const createGroupsRouter = (groupsService: IGroupsService) => {
  return router({
    getAll: protectedProcedure.query(async ({ ctx }) => {
      const groups = await groupsService.getGroups(ctx.user.id);
      const response: TrpcSuccessResponse<GroupWithDetails[]> = {
        success: true,
        data: groups,
        message: "response:groups.groupsFetched",
      };

      return response;
    }),
    create: protectedProcedure
      .input(createGroupSchema)
      .mutation(async ({ ctx, input }) => {
        await groupsService.create(input, ctx.user.id);

        const response: TrpcSuccessResponse<null> = {
          success: true,
          data: null,
          message: "response:groups.created",
        };

        return response;
      }),
    updateName: groupAdminProcedure
      .input(updateGroupInputSchema)
      .mutation(async ({ input }) => {
        await groupsService.updateName(input.groupId, input.data);

        const response: TrpcSuccessResponse<null> = {
          success: true,
          data: null,
          message: "response:groups.updatedName",
        };

        return response;
      }),
    delete: groupAdminProcedure
      .input(groupParamsSchema)
      .mutation(async ({ input }) => {
        await groupsService.remove(input.groupId);

        const response: TrpcSuccessResponse<null> = {
          success: true,
          data: null,
          message: "response:groups.deleted",
        };

        return response;
      }),
    removeMember: groupAdminProcedure
      .input(memberParamsSchema)
      .mutation(async ({ input }) => {
        await groupsService.removeMember(input.groupId, input.memberId);

        const response: TrpcSuccessResponse<null> = {
          success: true,
          data: null,
          message: "response:groups.memberRemoved",
        };

        return response;
      }),
    updateMemberRole: groupAdminProcedure
      .input(updateMemberRoleInputSchema)
      .mutation(async ({ input }) => {
        await groupsService.updateMemberRole(input.groupId, input.memberId, {
          role: input.role,
        });

        const response: TrpcSuccessResponse<null> = {
          success: true,
          data: null,
          message: "response:groups.memberRoleUpdated",
        };

        return response;
      }),
  });
};
