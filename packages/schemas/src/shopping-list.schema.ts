import { z } from "zod";

const shoppingListItemSchema = z.object({
  id: z.string(),
  groupId: z.string(),
  name: z.string().min(1, { message: "validation:required" }),
  quantity: z.number().int().positive().default(1),
  completed: z.boolean(),
  order: z.number(),
});

export const createShoppingListItemSchema = shoppingListItemSchema
  .pick({
    name: true,
  })
  .extend({
    quantity: shoppingListItemSchema.shape.quantity.optional(),
  });

export const updateShoppingListItemSchema = shoppingListItemSchema.pick({
  id: true,
  groupId: true,
  name: true,
  quantity: true,
  completed: true,
});

export const removeShoppingListItemsSchema = shoppingListItemSchema
  .pick({
    groupId: true,
  })
  .extend({
    itemIds: z.array(shoppingListItemSchema.shape.id),
  });

export const reorderShoppingListSchema = shoppingListItemSchema
  .pick({
    groupId: true,
  })
  .extend({
    items: z.array(
      z.object({
        id: shoppingListItemSchema.shape.id,
        order: shoppingListItemSchema.shape.order,
      }),
    ),
  });

export type ShoppingListItem = z.infer<typeof shoppingListItemSchema>;

export type CreateShoppingListItemDto = z.infer<
  typeof createShoppingListItemSchema
>;

export type UpdateShoppingListItemDto = z.infer<
  typeof updateShoppingListItemSchema
>;

export type RemoveShoppingListItemsDto = z.infer<
  typeof removeShoppingListItemsSchema
>;

export type ReorderShoppingListDto = z.infer<typeof reorderShoppingListSchema>;
