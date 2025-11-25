"use client";

import { useAuthStore } from "@/shared/store/auth.store";
import { useRouter } from "next/navigation";
import { APP_PATHS } from "@repo/config";
import { useUiStore } from "@/shared/store/ui.store";
import { trpc } from "@repo/trpc/react";
import { handleError } from "@/shared/lib/error/handle-error";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export function useLogout() {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  const { closeSheet, closeDialog } = useUiStore();
  const { t } = useTranslation();

  const { mutate } = trpc.auth.logout.useMutation({
    onSuccess: (response) => {
      toast.success(t(response.message));
      closeSheet();
      closeDialog();
      logout();

      router.push(APP_PATHS.login);
    },
    onError: (error) => {
      handleError({ error });
    },
  });

  return { handleLogout: () => mutate() };
}
