import { useRef } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { socket } from "@/shared/lib/socket";
import { EVENT_NAME } from "@repo/config";
import { trpc } from "@repo/trpc/react";
import { handleError } from "@/shared/lib/error/handle-error";
import type { ShoppingListItem } from "@repo/schemas";

const UNDO_DELAY = 3000;
const REMOVE_TOAST_ID = "remove-items-toast";

export function useRemoveItem(groupId: string) {
  const { t } = useTranslation("common");
  const utils = trpc.useUtils();

  const removalTimerRef = useRef<NodeJS.Timeout | null>(null);
  const itemsToRemoveRef = useRef<ShoppingListItem[]>([]);
  const itemToUndoRef = useRef<ShoppingListItem | null>(null);

  const restoreItemsToCache = (itemsToRestore: ShoppingListItem[]) => {
    utils.shoppingList.get.setData({ groupId }, (oldData) => {
      if (!oldData) return oldData;

      const existingIds = new Set(oldData.data.map((item) => item.id));
      const newItems = itemsToRestore.filter(
        (item) => !existingIds.has(item.id),
      );

      if (newItems.length === 0) return oldData;

      return {
        ...oldData,
        data: [...oldData.data, ...newItems].sort((a, b) => a.order - b.order),
      };
    });
  };

  const deleteMutation = trpc.shoppingList.delete.useMutation({
    onError: (error) => {
      restoreItemsToCache(itemsToRemoveRef.current);
      handleError({ error, showToast: true });
    },
  });

  const initiateRemove = (itemToRemove: ShoppingListItem) => {
    if (removalTimerRef.current) {
      clearTimeout(removalTimerRef.current);
    }

    if (!itemsToRemoveRef.current.some((i) => i.id === itemToRemove.id)) {
      itemsToRemoveRef.current.push(itemToRemove);
    }
    itemToUndoRef.current = itemToRemove;

    utils.shoppingList.get.setData({ groupId }, (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        data: oldData.data.filter((item) => item.id !== itemToRemove.id),
      };
    });

    socket.emit(EVENT_NAME.itemSoftDelete, {
      itemId: itemToRemove.id,
      groupId,
    });

    removalTimerRef.current = setTimeout(() => {
      if (itemsToRemoveRef.current.length > 0) {
        const ids = itemsToRemoveRef.current.map((i) => i.id);
        deleteMutation.mutate({ groupId, itemIds: ids });

        itemsToRemoveRef.current = [];
        itemToUndoRef.current = null;
        toast.dismiss(REMOVE_TOAST_ID);
      }
    }, UNDO_DELAY);

    toast.success(
      t("shoppingList.itemRemovedMsg", { itemName: itemToRemove.name }),
      {
        id: REMOVE_TOAST_ID,
        duration: UNDO_DELAY - 500,
        dismissible: true,
        action: {
          label: t("shoppingList.undo"),
          onClick: () => {
            const itemToRestore = itemToUndoRef.current;
            if (!itemToRestore) return;

            restoreItemsToCache([itemToRestore]);
            socket.emit(EVENT_NAME.itemRestore, {
              itemId: itemToRestore.id,
              groupId,
            });

            itemsToRemoveRef.current = itemsToRemoveRef.current.filter(
              (item) => item.id !== itemToRestore.id,
            );
            itemToUndoRef.current = null;
          },
        },
      },
    );
  };

  return { mutate: initiateRemove, isPending: deleteMutation.isPending };
}
