import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useReorderItems } from "@/features/shopping-list/subfeatures/reorder-item/use-reorder-items.hook";
import { useShoppingListItems } from "./use-shopping-list-items.hook";
import { ShoppingListItem } from "@repo/schemas";

export function useShoppingList(groupId: string) {
  const { reorderItems } = useReorderItems(groupId);
  const {
    data: serverResponse,
    isError,
    isLoading,
  } = useShoppingListItems(groupId);

  const items: ShoppingListItem[] = serverResponse?.data ?? [];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      if (oldIndex === -1 || newIndex === -1) return;

      const reorderedItems = arrayMove(items, oldIndex, newIndex);

      reorderItems(reorderedItems);
    }
  }

  return {
    items,
    sensors,
    handleDragEnd,
    isError,
    isLoading,
  };
}
