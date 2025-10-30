"use client";

import { usePathname } from "next/navigation";

import { Button } from "@/shared/ui/button";
import { ArrowLeft, Settings } from "lucide-react";
import { APP_PATHS } from "@repo/config";
import { useTranslation } from "react-i18next";
import { InvitationsBell } from "@/features/groups/subfeatures/invitations/invitations-bell.component";
import { LoadingLink } from "@/shared/components/loading-link.component";
import { SHEET_TYPES, useUiStore } from "@/shared/store/ui.store";
import { useProfile } from "@/features/settings/hooks/use-profile.hook";

export function DashboardHeader() {
  const pathname = usePathname();
  const { data: profile } = useProfile();
  const { t } = useTranslation();
  const openSheet = useUiStore((state) => state.openSheet);

  const isDashboardHome = pathname === APP_PATHS.dashboard;
  const greeting = t("common:hello");

  return (
    <header className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-4">
        {!isDashboardHome && (
          <LoadingLink href={APP_PATHS.dashboard}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </LoadingLink>
        )}
        <h1 className="text-2xl font-bold">
          {isDashboardHome && profile?.data.name
            ? `${greeting}, ${profile.data.name}!`
            : ""}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <InvitationsBell />
        <Button
          size="icon"
          variant={"ghost"}
          onClick={() => openSheet(SHEET_TYPES.SETTINGS, {})}
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
