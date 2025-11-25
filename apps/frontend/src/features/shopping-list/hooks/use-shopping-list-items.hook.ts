"use client";

import { trpc } from "@repo/trpc/react";

export function useShoppingListItems(groupId: string) {
  return trpc.shoppingList.get.useQuery({ groupId });
}
