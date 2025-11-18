import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useUiStore } from "@/shared/store/ui.store";
import { handleError } from "@/shared/lib/error/handle-error";
import { trpc } from "@repo/trpc/react";

type UseUpdateProfileResult = ReturnType<
  typeof trpc.account.updateProfile.useMutation
>;

export function useUpdateProfile(): UseUpdateProfileResult {
  const queryClient = useQueryClient();
  const { t } = useTranslation("validation");
  const { closeSheet } = useUiStore();

  return trpc.account.updateProfile.useMutation({
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: [["account", "getProfile"]],
      });
      toast.success(t("success.profileUpdated"));
      closeSheet();
    },
    onError: (error) => {
      handleError({ error, showToast: true });
    },
  });
}
