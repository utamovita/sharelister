"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordDto } from "@repo/schemas";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { handleError } from "@/shared/lib/error/handle-error";
import { trpc } from "@repo/trpc/react";

export function useForgotPasswordForm() {
  const { t } = useTranslation();
  const form = useForm<ForgotPasswordDto>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const { mutate, isPending } = trpc.auth.forgotPassword.useMutation({
    onSuccess: (response) => {
      toast.success(t(response.message));
      form.reset();
    },
    onError: (error) => handleError({ error, showToast: true }),
  });

  const onSubmit = (values: ForgotPasswordDto) => {
    mutate(values);
  };

  return { form, onSubmit, isPending };
}
