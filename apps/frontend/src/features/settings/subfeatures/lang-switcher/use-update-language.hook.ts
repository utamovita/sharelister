import { useMutation, useQueryClient } from "@tanstack/react-query";
import { accountApi } from "../../api/account.api";
import { handleError } from "@/shared/lib/error/handle-error";
import { toast } from "sonner";
import { useUiStore } from "@/shared/store/ui.store";
import { useTranslation } from "react-i18next";

export function useUpdateLanguage() {
  const queryClient = useQueryClient();
  const { closeSheet } = useUiStore();
  const { t } = useTranslation("validation");

  return useMutation({
    mutationFn: accountApi.updateLanguage,
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
