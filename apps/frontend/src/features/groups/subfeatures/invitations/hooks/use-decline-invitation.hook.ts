"use client";
import { toast } from "sonner";
import { handleError } from "@/shared/lib/error/handle-error";
import { useTranslation } from "react-i18next";
import { trpc } from "@repo/trpc/react";

export function useDeclineInvitation() {
  const { t } = useTranslation();
  const utils = trpc.useUtils();

  return trpc.invitations.decline.useMutation({
    onSuccess: (response) => {
      toast.info(t(response.message));
      utils.invitations.getReceived.invalidate();
    },
    onError: (error) => handleError({ error }),
  });
}
