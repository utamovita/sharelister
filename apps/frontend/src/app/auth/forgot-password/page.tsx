import ForgotPasswordForm from "@/features/auth/subfeatures/forgot-password/forgot-password-form.component";
import { UnauthenticatedOnly } from "@/features/auth/components/unauthenticated-only.component";

export default function ForgotPasswordPage() {
  return (
    <UnauthenticatedOnly>
      <div className="flex h-screen w-full items-center justify-center bg-muted p-4">
        <ForgotPasswordForm />
      </div>
    </UnauthenticatedOnly>
  );
}
