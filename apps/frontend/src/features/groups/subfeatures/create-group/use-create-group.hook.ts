"use client";

import { toast } from "sonner";

import { useTranslation } from "react-i18next";
import { handleError } from "@/shared/lib/error/handle-error";
import { trpc } from "@repo/trpc/react";
import { useUiStore } from "@/shared/store/ui.store";
import { useForm } from "react-hook-form";
import { CreateGroupDto, createGroupSchema } from "@repo/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

export function useCreateGroup() {
  const { t } = useTranslation();
  const utils = trpc.useUtils();
  const { closeDialog } = useUiStore();

  const form = useForm<CreateGroupDto>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      name: "",
    },
  });

  const createGroupMutation = trpc.groups.create.useMutation({
    onSuccess: (response) => {
      utils.groups.getAll.invalidate();
      toast.success(t(response.message));
      closeDialog();
      form.reset();
    },
    onError: (error) => {
      handleError({ error });
    },
  });

  return { createGroupMutation, form };
}
