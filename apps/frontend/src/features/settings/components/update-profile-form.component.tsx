"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserSchema, UpdateUserDto } from "@repo/schemas";
import { useProfile } from "../hooks/use-profile.hook";
import { useUpdateProfile } from "../hooks/use-update-profile.hook";
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

export function UpdateProfileForm() {
  const { t } = useTranslation("common");
  const { data: profile } = useProfile();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const form = useForm<UpdateUserDto>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      username: profile?.data.name ?? "",
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
