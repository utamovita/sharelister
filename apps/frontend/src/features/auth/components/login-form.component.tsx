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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useLoginForm } from "@/features/auth/hooks/use-login-form.hook";
import { APP_PATHS } from "@repo/config";
import { useSearchParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import { GoogleLoginButton } from "@/features/auth/components/google-login-button";

export default function LoginForm() {
  const { form, onSubmit, isPending } = useLoginForm();
  const { t } = useTranslation("common");
  const searchParams = useSearchParams();
  const errorType = searchParams.get("error");

  return (
    <Card className="w-[400px]">
      <CardHeader>
        {errorType === "provider_mismatch" && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>{t("auth.error.providerMismatchTitle")}</AlertTitle>
            <AlertDescription>
              {t("auth.error.providerMismatchDescription")}
            </AlertDescription>
          </Alert>
        )}
        <CardTitle className={"text-center"} role="heading" aria-level={2}>
          {t("auth.loginTitle")}
        </CardTitle>
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("formFields.password")}</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" isLoading={isPending}>
              {t("auth.loginTitle")}
            </Button>
          </form>
        </Form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              {t("auth.orContinueWith")}
            </span>
          </div>
        </div>
        <GoogleLoginButton />
      </CardContent>
      <CardFooter>
        <CardDescription className={"text-center w-full"}>
          {t("auth.noAccountPrompt")}{" "}
          <Link
            href={APP_PATHS.register}
            className="text-primary hover:underline"
          >
            {t("auth.registerTitle")}
          </Link>
        </CardDescription>
      </CardFooter>
    </Card>
  );
}
