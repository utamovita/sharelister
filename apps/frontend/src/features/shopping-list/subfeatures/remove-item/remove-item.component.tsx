import { Button } from "@/shared/ui/button";
import { Trash2 } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import type { ShoppingListItem } from "@repo/schemas";

type RemoveItemProps = {
  item: ShoppingListItem;
  onRemove: (item: ShoppingListItem) => void;
};

function RemoveItem({ item, onRemove }: RemoveItemProps) {
  const { t } = useTranslation("common");

  return (
    <Button
      variant="ghost"
      size="icon"
      role={"button"}
      onClick={() => onRemove(item)}
      aria-label={t("shoppingList.remove-item", { itemName: item.name })}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <Trash2 className="h-4 w-4 text-destructive" />
    </Button>
  );
}

export { RemoveItem };
