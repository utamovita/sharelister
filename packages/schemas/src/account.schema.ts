import { z } from "zod";

export const updateUserSchema = z.object({
  username: z.string().min(3, {
    message: JSON.stringify({
      key: "validation:name.minLength",
      values: { count: 3 },
    }),
  }),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;

export const updateUserLanguageSchema = z.object({
  lang: z.enum(["pl", "en"]),
});

export type UpdateUserLanguageDto = z.infer<typeof updateUserLanguageSchema>;
