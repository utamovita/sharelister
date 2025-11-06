"use client";
import ResetPasswordForm from "@/features/auth/subfeatures/reset-password/reset-password-form.component";
import { UnauthenticatedOnly } from "@/features/auth/components/unauthenticated-only.component";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import { APP_PATHS } from "@repo/config";

function ResetPasswordPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      router.replace(APP_PATHS.login);
    }
  }, [token, router]);

  if (!token) {
    return null; // Lub jakiś spinner
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-muted p-4">
      <ResetPasswordForm token={token} />
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <UnauthenticatedOnly>
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordPageContent />
      </Suspense>
    </UnauthenticatedOnly>
  );
}
