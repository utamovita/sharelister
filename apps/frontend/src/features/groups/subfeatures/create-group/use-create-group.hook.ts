"use client";

import { toast } from "sonner";

import { useTranslation } from "react-i18next";
import { handleError } from "@/shared/lib/error/handle-error";
import { trpc } from "@repo/trpc/react";

export function useCreateGroup() {
  const { t } = useTranslation(["common"]);
  const utils = trpc.useUtils();

  return trpc.groups.create.useMutation({
    onSuccess: (response) => {
      utils.groups.getAll.invalidate();
      toast.success(t(response.message));
    },
    onError: (error) => {
      handleError({ error });
    },
  });
}
