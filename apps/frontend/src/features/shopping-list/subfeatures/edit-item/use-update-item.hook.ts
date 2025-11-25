"use client";

import { handleError } from "@/shared/lib/error/handle-error";
import { trpc } from "@repo/trpc/react";

export function useUpdateItem(groupId: string) {
  const utils = trpc.useUtils();

  return trpc.shoppingList.update.useMutation({
    onMutate: async (variables) => {
      await utils.shoppingList.get.cancel({ groupId });

      const previousData = utils.shoppingList.get.getData({ groupId });

      utils.shoppingList.get.setData({ groupId }, (oldData) => {
        if (!oldData) return oldData;

        const { id, ...changes } = variables;

        return {
          ...oldData,
          data: oldData.data.map((item) =>
            item.id === id ? { ...item, ...changes } : item,
          ),
        };
      });

      return { previousData };
    },
    onError: (error, _variables, context) => {
      if (context?.previousData) {
        utils.shoppingList.get.setData({ groupId }, context.previousData);
      }
      handleError({ error, showToast: true });
    },
    onSettled: () => {
      utils.shoppingList.get.invalidate({ groupId });
    },
  });
}
