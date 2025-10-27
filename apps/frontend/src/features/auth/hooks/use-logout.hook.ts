"use client";

import { useAuthStore } from "@/shared/store/auth.store";
import { useRouter } from "next/navigation";
import { APP_PATHS } from "@repo/config";
import { useUiStore } from "@/shared/store/ui.store";

export function useLogout() {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  const { closeSheet, closeDialog } = useUiStore();

  const handleLogout = () => {
    closeSheet();
    closeDialog();
    logout();
    router.push(APP_PATHS.login);
  };

  return { handleLogout };
}
