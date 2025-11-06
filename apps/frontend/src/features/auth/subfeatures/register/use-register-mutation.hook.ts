"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "../../services/auth.service";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { LoginDto, RegisterDto } from "@repo/schemas";
import { SuccessResponse } from "@repo/types";
import { APP_PATHS } from "@repo/config";
import { handleError } from "@/shared/lib/error/handle-error";

type FormSchema = LoginDto | RegisterDto;

export function useRegisterMutation() {
  const router = useRouter();
  const { t } = useTranslation();

  return useMutation<SuccessResponse<{ message: string }>, Error, FormSchema>({
    mutationFn: (values: FormSchema) => {
      return authService.register(values as RegisterDto);
    },
    onSuccess: (response) => {
      if (response.message) {
        toast.success(t(response.message));
        router.push(APP_PATHS.login);
      }
    },
    onError: (error) => {
      handleError({ error, showToast: true });
    },
  });
}
