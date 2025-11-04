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
import { env } from "@/shared/lib/env";

const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" width="24px" height="24px">
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    ></path>
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    ></path>
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.566-3.463-11.127-8.192l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    ></path>
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.021,35.591,44,30.134,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    ></path>
  </svg>
);

export default function LoginForm() {
  const { form, onSubmit, isPending } = useLoginForm();
  const { t } = useTranslation("common");

  const googleLoginUrl = `${env.NEXT_PUBLIC_API_URL}/auth/google`;

  return (
    <Card className="w-[400px]">
      <CardHeader>
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
              {t("common:orContinueWith")}
            </span>
          </div>
        </div>
        <Button variant="outline" className="w-full" asChild>
          <a href={googleLoginUrl}>
            <GoogleIcon />
            <span className="ml-2">Zaloguj się z Google</span>
          </a>
        </Button>
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
