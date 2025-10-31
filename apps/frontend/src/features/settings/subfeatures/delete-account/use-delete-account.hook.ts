"use client";

import { useMutation } from "@tanstack/react-query";
import { accountApi } from "@/features/settings/api/account.api";
import { handleError } from "@/shared/lib/error/handle-error";
import { useLogout } from "@/features/auth/hooks/use-logout.hook";

export function useDeleteAccount() {
  const { handleLogout } = useLogout();

  return useMutation({
    mutationFn: accountApi.deleteAccount,
    onSuccess: () => {
      handleLogout();
    },
    onError: (error) => {
      handleError({ error, showToast: true });
    },
  });
}
