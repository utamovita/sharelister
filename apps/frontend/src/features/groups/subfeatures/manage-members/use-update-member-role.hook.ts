"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { handleError } from "@/shared/lib/error/handle-error";
import { groupsApi } from "@/features/groups/api/groups.api";
import { useTranslation } from "react-i18next";
import { useUiStore } from "@/shared/store/ui.store";

export function useUpdateMemberRole() {
  const queryClient = useQueryClient();
  const { t } = useTranslation("common");
  const { closeDialog } = useUiStore();
  return useMutation({
    mutationFn: groupsApi.updateMemberRole,
    onSuccess: () => {
      toast.success(t("group.manageMembers.roleUpdatedSuccess"));
      closeDialog();
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
    onError: (error) => {
      handleError({ error });
    },
  });
}
