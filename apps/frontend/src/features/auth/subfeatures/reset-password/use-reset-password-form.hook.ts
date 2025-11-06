"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordDto } from "@repo/schemas";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../../api/auth.api";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { handleError } from "@/shared/lib/error/handle-error";
import { useRouter } from "next/navigation";
import { APP_PATHS } from "@repo/config";

export function useResetPasswordForm(token: string) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const form = useForm<Omit<ResetPasswordDto, "token">>({
    resolver: zodResolver(resetPasswordSchema.omit({ token: true })),
    defaultValues: { password: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ResetPasswordDto) => authApi.resetPassword(data),
    onSuccess: () => {
      toast.success(t("auth.passwordResetSuccess"));
      router.replace(APP_PATHS.login);
    },
    onError: (error) => handleError({ error, showToast: true }),
  });

  const onSubmit = (values: { password: string }) => {
    mutate({ ...values, token });
  };

  return { form, onSubmit, isPending };
}
