"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordDto } from "@repo/schemas";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { handleError } from "@/shared/lib/error/handle-error";
import { useRouter } from "next/navigation";
import { APP_PATHS } from "@repo/config";
import { trpc } from "@repo/trpc/react";

export function useResetPasswordForm(token: string) {
  const { t } = useTranslation();
  const router = useRouter();
  const form = useForm<Omit<ResetPasswordDto, "token">>({
    resolver: zodResolver(resetPasswordSchema.omit({ token: true })),
    defaultValues: { password: "" },
  });

  const { mutate, isPending } = trpc.auth.resetPassword.useMutation({
    onSuccess: (response) => {
      toast.success(t(response.message));
      router.replace(APP_PATHS.login);
    },
    onError: (error) => handleError({ error, showToast: true }),
  });

  const onSubmit = (values: { password: string }) => {
    mutate({ ...values, token });
  };

  return { form, onSubmit, isPending };
}
