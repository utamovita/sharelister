import {
  createInvitationInputSchema,
  invitationParamsSchema,
} from "@repo/schemas";
import { router } from "../trpc";
import type { IInvitationsService } from "../services";
import { groupAdminProcedure, protectedProcedure } from "../procedures";
import { Invitation, TrpcSuccessResponse } from "@repo/types";

export const createInvitationsRouter = (
  invitationsService: IInvitationsService,
) => {
  return router({
    getReceived: protectedProcedure.query(async ({ ctx }) => {
      const invitations = await invitationsService.findAllReceivedForUser(
        ctx.user.id,
      );

      const response: TrpcSuccessResponse<Invitation[]> = {
        success: true,
        data: invitations,
        message: "response:invitations.fetched",
      };

      return response;
    }),

    create: groupAdminProcedure
      .input(createInvitationInputSchema)
      .mutation(async ({ ctx, input }) => {
        const { groupId, ...dto } = input;

        await invitationsService.create(groupId, ctx.user.id, dto);

        const response: TrpcSuccessResponse<null> = {
          success: true,
          data: null,
          message: "response:invitation.sent",
        };

        return response;
      }),

    accept: protectedProcedure
      .input(invitationParamsSchema)
      .mutation(async ({ ctx, input }) => {
        await invitationsService.accept(input.invitationId, ctx.user.id);

        const response: TrpcSuccessResponse<null> = {
          success: true,
          data: null,
          message: "response:invitation.accepted",
        };

        return response;
      }),

    decline: protectedProcedure
      .input(invitationParamsSchema)
      .mutation(async ({ ctx, input }) => {
        await invitationsService.decline(input.invitationId, ctx.user.id);

        const response: TrpcSuccessResponse<null> = {
          success: true,
          data: null,
          message: "response:invitation.declined",
        };

        return response;
      }),
  });
};
