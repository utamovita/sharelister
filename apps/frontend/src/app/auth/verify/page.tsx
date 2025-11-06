"use client";
import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/shared/store/auth.store";
import { APP_PATHS } from "@repo/config";
import { toast } from "sonner";
import { SpinnerOverlay } from "@/shared/ui/spinner";

function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setTokens = useAuthStore((state) => state.setTokens);
  const token = searchParams.get("token");

  const { mutate, isPending } = useMutation({
    mutationFn: (token: string) => authApi.verifyEmail(token),
    onSuccess: (response) => {
      setTokens(response.data.data);
      toast.success("TODO: E-mail zweryfikowany! Zalogowano.");
      router.replace(APP_PATHS.dashboard);
    },
    onError: () => {
      toast.error("TODO: Błąd weryfikacji. Spróbuj ponownie.");
      router.replace(APP_PATHS.login);
    },
  });

  useEffect(() => {
    if (token) {
      mutate(token);
    } else {
      router.replace(APP_PATHS.login);
    }
  }, [token, mutate, router]);

  if (isPending) return <SpinnerOverlay variant="page" />;
  return null;
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<SpinnerOverlay variant="page" />}>
      <VerifyEmail />
    </Suspense>
  );
}
