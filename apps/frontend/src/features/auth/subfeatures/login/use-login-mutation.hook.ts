"use client";

import { useAuthStore } from "@/shared/store/auth.store";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "../../services/auth.service";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { AuthResponseType, LoginDto, RegisterDto } from "@repo/schemas";
import { SuccessResponse } from "@repo/types";
import { APP_PATHS } from "@repo/config";
import { handleError } from "@/shared/lib/error/handle-error";

type FormSchema = LoginDto | RegisterDto;

export function useLoginMutation() {
  const setTokens = useAuthStore((state) => state.setTokens);
  const router = useRouter();
  const { t } = useTranslation();

  return useMutation<SuccessResponse<AuthResponseType>, Error, FormSchema>({
    mutationFn: (values: FormSchema) => {
      return authService.login(values as LoginDto);
    },
    onSuccess: (response) => {
      const { accessToken, refreshToken } = response.data;

      if (accessToken && refreshToken) {
        setTokens({ accessToken, refreshToken });
        if (response.message) {
          toast.success(t(response.message));
        }
        router.replace(APP_PATHS.dashboard);
      }
    },
    onError: (error) => {
      handleError({ error, showToast: true });
    },
  });
}
