"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/shared/store/auth.store";
import { APP_PATHS } from "@repo/config";
import { SpinnerOverlay } from "@/shared/ui/spinner";
import { toast } from "sonner";

function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setTokens = useAuthStore((state) => state.setTokens);

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    if (accessToken && refreshToken) {
      setTokens({ accessToken, refreshToken });
      toast.success("Zalogowano pomyślnie!");
      router.replace(APP_PATHS.dashboard);
    } else {
      toast.error("Wystąpił błąd podczas logowania.");
      router.replace(APP_PATHS.login);
    }
  }, [router, searchParams, setTokens]);

  return <SpinnerOverlay variant="page" spinnerSize="lg" />;
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<SpinnerOverlay variant="page" spinnerSize="lg" />}>
      <AuthCallback />
    </Suspense>
  );
}
