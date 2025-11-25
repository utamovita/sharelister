"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/shared/store/auth.store";
import { APP_PATHS } from "@repo/config";
import { toast } from "sonner";
import { SpinnerOverlay } from "@/shared/ui/spinner";
import { trpc } from "@repo/trpc/react";
import { useTranslation } from "react-i18next";

function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setTokens = useAuthStore((state) => state.setTokens);
  const token = searchParams.get("token");
  const { t } = useTranslation("validation");

  const { data, error, isLoading } = trpc.auth.verifyEmail.useQuery(
    { token: token! },
    {
      enabled: !!token,
      retry: false,
      staleTime: Infinity,
    },
  );

  useEffect(() => {
    if (!token) {
      router.replace(APP_PATHS.login);
      return;
    }

    if (data?.success) {
      const { accessToken, refreshToken } = data.data;
      setTokens({ accessToken, refreshToken });
      toast.success(t("success.emailVerified"));
      router.replace(APP_PATHS.dashboard);
    }

    if (error) {
      const message = error.message || t("error.invalidVerificationToken");
      toast.error(t(message));
      router.replace(APP_PATHS.login);
    }
  }, [token, data, error, router, setTokens, t]);

  if (token && isLoading) {
    return <SpinnerOverlay variant="page" />;
  }

  return null;
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<SpinnerOverlay variant="page" />}>
      <VerifyEmail />
    </Suspense>
  );
}
