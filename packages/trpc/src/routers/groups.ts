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

export const createGroupsRouter = (groupsService: IGroupsService) => {
  return router({
    getAll: protectedProcedure.query(({ ctx }) => {
      return groupsService.findAllForUser(ctx.user.id);
    }),
    create: protectedProcedure
      .input(createGroupSchema)
      .mutation(({ ctx, input }) => {
        return groupsService.create(input, ctx.user.id);
      }),
    update: groupAdminProcedure
      .input(updateGroupInputSchema)
      .mutation(({ input }) => {
        return groupsService.update(input.groupId, input.data);
      }),
    delete: groupAdminProcedure
      .input(groupParamsSchema)
      .mutation(({ input }) => {
        return groupsService.remove(input.groupId);
      }),
    removeMember: groupAdminProcedure
      .input(memberParamsSchema)
      .mutation(({ input }) => {
        return groupsService.removeMember(input.groupId, input.memberId);
      }),
    updateMemberRole: groupAdminProcedure
      .input(updateMemberRoleInputSchema)
      .mutation(({ input }) => {
        return groupsService.updateMemberRole(input.groupId, input.memberId, {
          role: input.role,
        });
      }),
  });
};
