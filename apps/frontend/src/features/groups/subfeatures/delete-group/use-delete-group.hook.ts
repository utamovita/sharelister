"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { handleError } from "@/shared/lib/error/handle-error";
import { useUiStore } from "@/shared/store/ui.store";
import { trpc } from "@repo/trpc/react";

export function useDeleteGroup() {
  const { t } = useTranslation(["common"]);
  const { closeDialog } = useUiStore();
  const utils = trpc.useUtils();

  return trpc.groups.delete.useMutation({
    onSuccess: (response) => {
      utils.groups.getAll.invalidate();
      toast.success(t(response.message));
      closeDialog();
    },
    onError: (error) => {
      handleError({ error });
    },
  });
}
