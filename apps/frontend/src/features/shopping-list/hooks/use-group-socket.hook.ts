import { useEffect } from "react";
import { socket } from "@/shared/lib/socket";
import { EVENT_NAME } from "@repo/config";
import { trpc } from "@repo/trpc/react";

export function useGroupSocket(groupId: string) {
  const utils = trpc.useUtils();

  useEffect(() => {
    const onUpdate = (payload: { groupId: string }) => {
      if (payload.groupId === groupId) {
        void utils.shoppingList.get.invalidate({ groupId });
      }
    };

    const onSoftDeleted = (payload: { itemId: string; groupId: string }) => {
      if (payload.groupId === groupId) {
        utils.shoppingList.get.setData({ groupId }, (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: oldData.data.filter((item) => item.id !== payload.itemId),
          };
        });
      }
    };

    const onRestored = (payload: { itemId: string; groupId: string }) => {
      if (payload.groupId === groupId) {
        void utils.shoppingList.get.invalidate({ groupId });
      }
    };

    socket.on(EVENT_NAME.shoppingListUpdated, onUpdate);
    socket.on(EVENT_NAME.itemSoftDeleted, onSoftDeleted);
    socket.on(EVENT_NAME.itemRestored, onRestored);
    socket.emit(EVENT_NAME.joinGroup, groupId);

    return () => {
      socket.emit(EVENT_NAME.leaveGroup, groupId);
      socket.off(EVENT_NAME.shoppingListUpdated, onUpdate);
      socket.off(EVENT_NAME.itemSoftDeleted, onSoftDeleted);
      socket.off(EVENT_NAME.itemRestored, onRestored);
    };
  }, [groupId, utils]);
}
