import { z } from "zod";
import { ROLES } from "@repo/types";

export const createGroupSchema = z.object({
  name: z
    .string()
    .min(1, { message: "validation:required" })
    .min(3, { message: "validation:name.minLength" }),
});

export const updateGroupSchema = z.object({
  name: z
    .string()
    .min(1, { message: "validation:required" })
    .min(3, { message: "validation:name.minLength" }),
});

export const updateMemberRoleSchema = z.object({
  role: z.enum(ROLES),
});

export const groupParamsSchema = z.object({
  groupId: z.string(),
});

export const updateGroupInputSchema = groupParamsSchema.extend({
  data: updateGroupSchema,
});

export const memberParamsSchema = groupParamsSchema.extend({
  memberId: z.string(),
});

export const updateMemberRoleInputSchema = memberParamsSchema.extend({
  role: z.enum([ROLES.ADMIN, ROLES.USER]),
});

export type CreateGroupDto = z.infer<typeof createGroupSchema>;
export type UpdateGroupDto = z.infer<typeof updateGroupSchema>;
export type UpdateMemberRoleDto = z.infer<typeof updateMemberRoleSchema>;
