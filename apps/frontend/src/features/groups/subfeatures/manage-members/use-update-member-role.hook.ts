"use client";

import { toast } from "sonner";
import { handleError } from "@/shared/lib/error/handle-error";
import { useTranslation } from "react-i18next";
import { useUiStore } from "@/shared/store/ui.store";
import { trpc } from "@repo/trpc/react";

export function useUpdateMemberRole() {
  const { t } = useTranslation("common");
  const { closeDialog } = useUiStore();
  const utils = trpc.useUtils();

  return trpc.groups.updateMemberRole.useMutation({
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
