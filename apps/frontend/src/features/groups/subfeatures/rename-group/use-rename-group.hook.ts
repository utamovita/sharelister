"use client";

import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { handleError } from "@/shared/lib/error/handle-error";
import { trpc } from "@repo/trpc/react";
import { useUiStore } from "@/shared/store/ui.store";

export function useRenameGroup() {
  const { t } = useTranslation();
  const { closeDialog } = useUiStore();
  const utils = trpc.useUtils();

  return trpc.groups.updateName.useMutation({
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
