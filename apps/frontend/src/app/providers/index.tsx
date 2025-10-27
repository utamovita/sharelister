"use client";

import "@/shared/lib/i18n/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "@/shared/ui/sonner";
import { ThemeProvider } from "@/app/providers/theme-provider";
import { DialogManager } from "@/widgets/dialog-manager";
import { useUiStore } from "@/shared/store/ui.store";
import { SpinnerOverlay } from "@/shared/ui/spinner";
import { PageTransitionManager } from "@/app/providers/page-transition-manager";
import { SheetManager } from "@/widgets/sheet-manager";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const isPageTransitioning = useUiStore((state) => state.isPageTransitioning);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <PageTransitionManager />
        {isPageTransitioning && (
          <SpinnerOverlay variant="page" spinnerSize="lg" />
        )}
        {children}
        <Toaster richColors />
        <DialogManager />
        <SheetManager />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
