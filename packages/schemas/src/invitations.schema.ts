import { z } from "zod";

export const createInvitationSchema = z.object({
  email: z.string().email({ message: "validation:email.invalid" }),
});

export const createInvitationInputSchema = createInvitationSchema.extend({
  groupId: z.string().min(1),
});

export const invitationParamsSchema = z.object({
  invitationId: z.string().min(1),
});

export type CreateInvitationDto = z.infer<typeof createInvitationSchema>;
