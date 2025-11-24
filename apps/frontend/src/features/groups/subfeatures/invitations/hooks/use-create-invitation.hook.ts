"use client";

import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { handleError } from "@/shared/lib/error/handle-error";
import { trpc } from "@repo/trpc/react";

export function useCreateInvitation() {
  const { t } = useTranslation();

  return trpc.invitations.create.useMutation({
    onSuccess: (response) => {
      toast.success(t(response.message));
    },
    onError: (error) => {
      handleError({ error });
    },
  });
}
