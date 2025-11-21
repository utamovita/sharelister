import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useUiStore } from "@/shared/store/ui.store";
import { handleError } from "@/shared/lib/error/handle-error";
import { trpc } from "@repo/trpc/react";

export function useUpdateUsername() {
  const { t } = useTranslation();
  const { closeSheet } = useUiStore();
  const utils = trpc.useUtils();

  return trpc.account.updateProfile.useMutation({
    onSuccess: (response) => {
      utils.account.getProfile.invalidate();
      toast.success(t(response.message));
      closeSheet();
    },
    onError: (error) => {
      handleError({ error, showToast: true });
    },
  });
}
