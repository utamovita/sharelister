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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/shared/ui/card";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useForgotPasswordForm } from "./use-forgot-password-form.hook";
import { APP_PATHS } from "@repo/config";

export default function ForgotPasswordForm() {
  const { form, onSubmit, isPending } = useForgotPasswordForm();
  const { t } = useTranslation("common");

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>{t("auth.forgotPasswordTitle")}</CardTitle>
        <CardDescription>{t("auth.forgotPasswordDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("formFields.email")}</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" isLoading={isPending}>
              {t("auth.sendResetLink")}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Link
          href={APP_PATHS.login}
          className="text-sm text-primary hover:underline w-full text-center"
        >
          {t("auth.backToLogin")}
        </Link>
      </CardFooter>
    </Card>
  );
}
