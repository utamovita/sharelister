"use client";

import { handleError } from "@/shared/lib/error/handle-error";
import { useLogout } from "@/features/auth/hooks/use-logout.hook";
import { trpc } from "@repo/trpc/react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export function useDeleteAccount() {
  const { handleLogout } = useLogout();
  const { t } = useTranslation();

  return trpc.account.deleteAccount.useMutation({
    onSuccess: (response) => {
      handleLogout();
      toast.success(t(response.message));
    },
    onError: (error) => {
      handleError({ error, showToast: true });
    },
  });
}
