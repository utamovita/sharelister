"use client";

import { useGroups } from "@/features/groups/hooks/use-groups.hook";
import { SpinnerOverlay } from "@/shared/ui/spinner";
import { AlertFallback } from "@/shared/ui/alert";
import { GroupCard } from "@/features/groups/components/group-card.component";
import { AddGroupCard } from "@/features/groups/subfeatures/create-group/add-group-card.component";
import { useTranslation } from "react-i18next";

export function GroupsPanel() {
  const { data: groups, isError, isLoading } = useGroups();
  const { t } = useTranslation();

  if (isLoading) {
    return <SpinnerOverlay variant="container" spinnerSize="lg" />;
  }

  if (isError || !groups) {
    return <AlertFallback />;
  }

  return (
    <div className="relative space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">
          {t("common:group.mainTitle")}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.data.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
        <AddGroupCard />
      </div>

      {groups.data.length === 0 && (
        <p className="text-muted-foreground pt-4 text-center">
          {t("common:group.noGroups")}
        </p>
      )}
    </div>
  );
}
