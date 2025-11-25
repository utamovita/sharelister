"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { APP_PATHS } from "@repo/config";
import { handleError } from "@/shared/lib/error/handle-error";
import { trpc } from "@repo/trpc/react";

export function useRegisterMutation() {
  const router = useRouter();
  const { t } = useTranslation();

  return trpc.auth.register.useMutation({
    onSuccess: (response) => {
      toast.success(t(response.message));
      router.push(APP_PATHS.login);
    },
    onError: (error) => {
      handleError({ error, showToast: true });
    },
  });
}
