"use client";

import { Button } from "@/shared/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInvitationSchema, CreateInvitationDto } from "@repo/schemas";
import { useCreateInvitation } from "@/features/groups/subfeatures/invitations/hooks/use-create-invitation.hook";
import { useTranslation } from "react-i18next";
import { useUiStore } from "@/shared/store/ui.store";

type CreateInvitationFormProps = {
  groupId: string;
};

export function CreateInvitationForm({ groupId }: CreateInvitationFormProps) {
  const { t } = useTranslation("common");
  const { mutate, isPending } = useCreateInvitation();
  const { closeDialog } = useUiStore();

  const form = useForm<CreateInvitationDto>({
    resolver: zodResolver(createInvitationSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (data: CreateInvitationDto) => {
    mutate(
      { groupId, ...data },
      {
        onSuccess: () => {
          form.reset();
          closeDialog();
        },
      },
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" isLoading={isPending}>
          {t("invitation.dialog.btnSend")}
        </Button>
      </form>
    </Form>
  );
}
