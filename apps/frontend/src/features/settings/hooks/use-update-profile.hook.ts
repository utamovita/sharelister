"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { accountApi } from "../api/account.api";
import { handleError } from "@/shared/lib/error/handle-error";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useUiStore } from "@/shared/store/ui.store";

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { t } = useTranslation("common");
  const { closeSheet, closeDialog } = useUiStore();

  return useMutation({
    mutationFn: accountApi.updateProfile,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });

      if (response.message) {
        toast.success(t(response.message));
        closeSheet();
      }
    },
    onError: (error) => {
      handleError({ error, showToast: true });
    },
  });
}
