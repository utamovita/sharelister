import { Checkbox } from "@/shared/ui/checkbox";
import { cn } from "@/shared/lib/utils";
import type { ShoppingListItem } from "@repo/database";
import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Check, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useUpdateItem } from "@/features/shopping-list/subfeatures/edit-item/use-update-item.hook";
import { RemoveItem } from "@/features/shopping-list/subfeatures/remove-item/remove-item.component";
import { EditItem } from "@/features/shopping-list/subfeatures/edit-item/edit-item.component";
import { useForm } from "react-hook-form";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";

type FormValues = {
  name: string;
  quantity: number;
};

type ShoppingListItemProps = {
  item: ShoppingListItem;
  onRemove: (item: ShoppingListItem) => void;
};

export const ShoppingListItemComponent = ({
  item,
  onRemove,
}: ShoppingListItemProps) => {
  const { t } = useTranslation("common");

  const [isEditing, setIsEditing] = useState(false);
  const { mutate: updateItem, isPending } = useUpdateItem(item.groupId);

  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      name: item.name,
      quantity: item.quantity,
    },
  });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id, disabled: isEditing });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : isEditing ? 20 : undefined,
    position: "relative" as const,
  };

  const handleToggleCompleted = (checked: boolean) => {
    updateItem({ itemId: item.id, completed: checked });
  };

  const handleCancelEdit = () => {
    reset({ name: item.name, quantity: item.quantity });
    setIsEditing(false);
  };

  const onSubmit = (data: FormValues) => {
    updateItem(
      {
        itemId: item.id,
        name: data.name,
        quantity: Number(data.quantity),
      },
      {
        onSuccess: () => setIsEditing(false),
      },
    );
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center p-2 md:p-4 border-b last-border-b-0 gap-2 md:gap-4 bg-background transition-colors",
        isEditing && "bg-muted",
      )}
    >
      {isEditing ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-grow flex items-center gap-2"
        >
          <Input
            {...register("name", { required: true })}
            className="h-9"
            disabled={isPending}
          />
          <Input
            type="number"
            {...register("quantity", {
              required: true,
              min: 1,
              valueAsNumber: true,
            })}
            className="h-9 w-20"
            disabled={isPending}
          />
          <Button
            type="submit"
            size="icon"
            className="h-9 w-10 min-w-10"
            isLoading={isPending}
            aria-label={"Zapisz zmiany"}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="h-9 w-10 min-w-10"
            onClick={handleCancelEdit}
            disabled={isPending}
            aria-label={"Anuluj"}
          >
            <X className="h-4 w-4" />
          </Button>
        </form>
      ) : (
        <>
          <Checkbox
            id={item.id}
            checked={item.completed}
            onCheckedChange={(checked) => handleToggleCompleted(!!checked)}
          />
          <label
            htmlFor={item.id}
            className={cn(
              "flex-grow cursor-pointer",
              item.completed && "line-through text-muted-foreground",
            )}
          >
            {item.name}
            {item.quantity > 1 && (
              <span className="ml-2 text-muted-foreground font-bold">
                (x{item.quantity})
              </span>
            )}
          </label>

          <div
            {...attributes}
            {...listeners}
            className="cursor-grab touch-none p-2"
            aria-label={t("shoppingList.dragHandleLabel", {
              itemName: item.name,
            })}
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>

          <EditItem onEdit={() => setIsEditing(true)} itemName={item.name} />
          <RemoveItem item={item} onRemove={onRemove} />
        </>
      )}
    </li>
  );
};
