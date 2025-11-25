"use client";

import { useCreateGroup } from "./use-create-group.hook";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

import { useTranslation } from "react-i18next";
import type { CreateGroupDto } from "@repo/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";

export function CreateGroupForm() {
  const { createGroupMutation, form } = useCreateGroup();
  const { t } = useTranslation();

  const onSubmit = (data: CreateGroupDto) => {
    createGroupMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-start gap-2"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormLabel className="sr-only">
                {t("common:group.namePlaceholder")}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t("common:group.namePlaceholder")}
                  disabled={createGroupMutation.isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" isLoading={createGroupMutation.isPending}>
          {t("common:create")}
        </Button>
      </form>
    </Form>
  );
}
