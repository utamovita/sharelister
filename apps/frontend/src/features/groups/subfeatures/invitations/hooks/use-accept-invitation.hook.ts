"use client";
import { toast } from "sonner";
import { handleError } from "@/shared/lib/error/handle-error";
import { useTranslation } from "react-i18next";
import { trpc } from "@repo/trpc/react";

export function useAcceptInvitation() {
  const { t } = useTranslation();
  const utils = trpc.useUtils();

  return trpc.invitations.accept.useMutation({
    onSuccess: (response) => {
      toast.success(t(response.message));
      utils.invitations.getReceived.invalidate();
      utils.groups.getAll.invalidate();
    },
    onError: (error) => handleError({ error }),
  });
}
