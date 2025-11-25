"use client";

import { useAddItem } from "./use-add-item.hook";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { CreateShoppingListItemDto } from "@repo/schemas";
import { X } from "lucide-react";

function AddItem({ groupId }: { groupId: string }) {
  const { mutate: addItem, isPending } = useAddItem();
  const {
    register,
    handleSubmit,
    setFocus,
    reset,
    control,
    getValues,
    setValue,
  } = useForm<CreateShoppingListItemDto>({
    defaultValues: {
      name: "",
      quantity: 1,
    },
  });
  const [submissionCount, setSubmissionCount] = useState(0);
  const { t } = useTranslation("common");

  const [customQtyActive, setCustomQtyActive] = useState(() => {
    const initialQuantity = getValues("quantity");
    return initialQuantity ? initialQuantity > 10 : false;
  });

  const onSubmit = (data: CreateShoppingListItemDto) => {
    if (data.name.trim() === "") return;

    const payload = {
      groupId,
      name: data.name,
      quantity: Math.floor(data.quantity ?? 1),
    };

    addItem(payload, {
      onSuccess: () => {
        reset();
        setCustomQtyActive(false);
        setSubmissionCount((count) => count + 1);
      },
    });
  };

  useEffect(() => {
    if (submissionCount > 0) {
      setFocus("name");
    }
  }, [submissionCount, setFocus]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex items-start gap-2">
      <Input
        {...register("name", { required: true })}
        placeholder={t("shoppingList.addItemPlaceholder")}
        disabled={isPending}
        className="flex-grow"
      />

      <Controller
        control={control}
        name="quantity"
        render={({ field }) => (
          <>
            {customQtyActive ? (
              <div className="flex items-start gap-1">
                <Input
                  type="number"
                  min="1"
                  className="w-20"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                  disabled={isPending}
                  autoFocus
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 shrink-0"
                  onClick={() => {
                    setCustomQtyActive(false);
                    setValue("quantity", 1);
                  }}
                  aria-label="Anuluj ilość niestandardową"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Select
                value={String(field.value)}
                onValueChange={(value) => {
                  if (value === "custom") {
                    setCustomQtyActive(true);
                    setValue("quantity", 11);
                  } else {
                    setValue("quantity", parseInt(value, 10));
                  }
                }}
                disabled={isPending}
              >
                <SelectTrigger
                  className="w-20"
                  aria-label={t("shoppingList.selectQuantity")}
                >
                  <SelectValue placeholder="Qty" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(10)].map((_, i) => (
                    <SelectItem key={i + 1} value={String(i + 1)}>
                      {i + 1}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">10+</SelectItem>
                </SelectContent>
              </Select>
            )}
          </>
        )}
      />

      <Button type="submit" isLoading={isPending}>
        {t("add")}
      </Button>
    </form>
  );
}

export { AddItem };
