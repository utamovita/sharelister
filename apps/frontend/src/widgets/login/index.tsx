import LoginForm from "@/features/auth/subfeatures/login/login-form.component";

export default function LoginView() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-muted p-4">
      <LoginForm />
    </div>
  );
}
