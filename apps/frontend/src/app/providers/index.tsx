"use client";

import "@/shared/lib/i18n/client";
import { Toaster } from "@/shared/ui/sonner";
import { ThemeProvider } from "@/app/providers/theme-provider";
import { DialogManager } from "@/widgets/dialog-manager";
import { useUiStore } from "@/shared/store/ui.store";
import { SpinnerOverlay } from "@/shared/ui/spinner";
import { PageTransitionManager } from "@/app/providers/page-transition-manager";
import { SheetManager } from "@/widgets/sheet-manager";
import { TrpcProvider } from "@/app/providers/trpc-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  const isPageTransitioning = useUiStore((state) => state.isPageTransitioning);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <TrpcProvider>
        <PageTransitionManager />
        {isPageTransitioning && (
          <SpinnerOverlay variant="page" spinnerSize="lg" />
        )}
        {children}
        <Toaster richColors />
        <DialogManager />
        <SheetManager />
      </TrpcProvider>
    </ThemeProvider>
  );
}
