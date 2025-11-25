import {
  createShoppingListItemSchema,
  groupParamsSchema,
  removeShoppingListItemsSchema,
  reorderShoppingListSchema,
  updateShoppingListItemSchema,
} from "@repo/schemas";
import type { ShoppingListItem } from "@repo/schemas";
import type { SuccessResponse } from "@repo/types";
import { router } from "../trpc";
import type { IShoppingListService } from "../services";
import { groupProcedure } from "../procedures";

const createItemInput = createShoppingListItemSchema.merge(groupParamsSchema);
const reorderInput = reorderShoppingListSchema.merge(groupParamsSchema);
const removeInput = removeShoppingListItemsSchema.merge(groupParamsSchema);

export const createShoppingListRouter = (service: IShoppingListService) => {
  return router({
    get: groupProcedure.input(groupParamsSchema).query(async ({ input }) => {
      const items = await service.getItems(input.groupId);

      const response: SuccessResponse<ShoppingListItem[]> = {
        success: true,
        data: items,
        message: "response:shoppingList.fetched",
      };
      return response;
    }),

    create: groupProcedure
      .input(createItemInput)
      .mutation(async ({ ctx, input }) => {
        const { groupId, ...dto } = input;
        const item = await service.addItem(groupId, dto, ctx.user.id);

        const response: SuccessResponse<ShoppingListItem> = {
          success: true,
          data: item,
          message: "response:shoppingList.itemCreated",
        };
        return response;
      }),

    update: groupProcedure
      .input(updateShoppingListItemSchema)
      .mutation(async ({ input }) => {
        const item = await service.updateItem(input);

        const response: SuccessResponse<ShoppingListItem> = {
          success: true,
          data: item,
          message: "response:shoppingList.itemUpdated",
        };
        return response;
      }),

    delete: groupProcedure.input(removeInput).mutation(async ({ input }) => {
      await service.removeItems(input);

      const response: SuccessResponse<null> = {
        success: true,
        data: null,
        message: "response:shoppingList.itemsDeleted",
      };
      return response;
    }),

    reorder: groupProcedure.input(reorderInput).mutation(async ({ input }) => {
      await service.reorderItems(input);

      const response: SuccessResponse<null> = {
        success: true,
        data: null,
        message: "response:shoppingList.reordered",
      };
      return response;
    }),
  });
};
