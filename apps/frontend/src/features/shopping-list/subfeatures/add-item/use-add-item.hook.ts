"use client";

import { handleError } from "@/shared/lib/error/handle-error";
import { trpc } from "@repo/trpc/react";

export function useAddItem() {
  const utils = trpc.useUtils();

  return trpc.shoppingList.create.useMutation({
    onSuccess: (response) => {
      utils.shoppingList.get.invalidate({ groupId: response.data.groupId });
    },
    onError: (error) => {
      handleError({ error });
    },
  });
}
