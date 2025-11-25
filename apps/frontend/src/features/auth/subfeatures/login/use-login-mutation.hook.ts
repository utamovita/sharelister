"use client";

import { useAuthStore } from "@/shared/store/auth.store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { APP_PATHS } from "@repo/config";
import { handleError } from "@/shared/lib/error/handle-error";
import { trpc } from "@repo/trpc/react";

export function useLoginMutation() {
  const setTokens = useAuthStore((state) => state.setTokens);
  const router = useRouter();
  const { t } = useTranslation();

  return trpc.auth.login.useMutation({
    onSuccess: (response) => {
      const { accessToken, refreshToken } = response.data;

      if (accessToken && refreshToken) {
        setTokens({ accessToken, refreshToken });
        toast.success(t(response.message));
        router.replace(APP_PATHS.dashboard);
      }
    },
    onError: (error) => {
      handleError({ error, showToast: true });
    },
  });
}
