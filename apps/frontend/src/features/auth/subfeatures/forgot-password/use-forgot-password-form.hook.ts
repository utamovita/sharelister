"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordDto } from "@repo/schemas";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../../api/auth.api";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { handleError } from "@/shared/lib/error/handle-error";

export function useForgotPasswordForm() {
  const { t } = useTranslation("validation");
  const form = useForm<ForgotPasswordDto>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => {
      toast.success(t("success.passwordResetLinkSent"));
      form.reset();
    },
    onError: (error) => handleError({ error, showToast: true }),
  });

  const onSubmit = (values: ForgotPasswordDto) => {
    mutate(values);
  };

  return { form, onSubmit, isPending };
}
