"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserSchema, UpdateUserDto } from "@repo/schemas";
import { useUpdateProfile } from "./use-update-profile.hook";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/ui/form";
import { Label } from "@/shared/ui/label";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { useTranslation } from "react-i18next";
import { trpc } from "@repo/trpc/react";

export function UpdateProfileForm() {
  const { t } = useTranslation("common");
  const { data: profile } = trpc.account.getProfile.useQuery();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const form = useForm<UpdateUserDto>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      username: profile?.name ?? "",
    },
  });

  const onSubmit = (data: UpdateUserDto) => {
    updateProfile(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="username">{t("formFields.username")}</Label>
              <FormControl>
                <Input
                  id="username"
                  placeholder={t("formFields.usernamePlaceholder")}
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="outline" isLoading={isPending}>
          {t("settings.account.updateButton")}
        </Button>
      </form>
    </Form>
  );
}
