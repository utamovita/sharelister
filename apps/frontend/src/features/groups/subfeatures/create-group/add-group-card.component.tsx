"use client";

import { Card, CardContent } from "@/shared/ui/card";
import { PlusCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DIALOG_TYPES, useUiStore } from "@/shared/store/ui.store";

export function AddGroupCard() {
  const { t } = useTranslation();
  const openDialog = useUiStore((state) => state.openDialog);

  return (
    <button
      className="w-full h-full"
      onClick={() => openDialog(DIALOG_TYPES.CREATE_GROUP, {})}
    >
      <Card className="h-35 border-2 border-dashed hover:border-primary transition-colors flex items-center justify-center cursor-pointer">
        <CardContent className="p-2">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <PlusCircle className="h-10 w-10" />
            <span>{t("common:group.createNew")}</span>
          </div>
        </CardContent>
      </Card>
    </button>
  );
}
