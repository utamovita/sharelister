import { handleError } from "@/shared/lib/error/handle-error";
import { trpc } from "@repo/trpc/react";
import { ShoppingListItem } from "@repo/schemas";

export function useReorderItems(groupId: string) {
  const utils = trpc.useUtils();

  const reorderItems = (reorderedItems: ShoppingListItem[]) => {
    const payloadToApi = reorderedItems.map((item, index) => ({
      id: item.id,
      order: index,
    }));

    utils.shoppingList.get.setData({ groupId }, (oldData) => {
      console.log(oldData);
      if (!oldData) return oldData;
      return {
        ...oldData,
        data: reorderedItems,
      };
    });

    mutation.mutate({ groupId, items: payloadToApi });
  };

  const mutation = trpc.shoppingList.reorder.useMutation({
    onMutate: async () => {
      await utils.shoppingList.get.cancel({ groupId });
      const previousData = utils.shoppingList.get.getData({ groupId });
      return { previousData };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        utils.shoppingList.get.setData({ groupId }, context.previousData);
      }
      handleError({
        error: new Error("Failed to reorder items"),
        showToast: true,
      });
    },
    onSettled: () => {
      utils.shoppingList.get.invalidate({ groupId });
    },
  });

  return { reorderItems };
}
