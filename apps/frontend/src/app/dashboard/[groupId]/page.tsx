"use client";
import { use } from "react";
import { Authorized } from "@/features/auth/components/authorized.component";
import { ShoppingListView } from "@/widgets/dashboard/shopping-list";
import { DashboardHeader } from "@/widgets/dashboard/dashboard-header.component";

export default function GroupPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = use(params);

  return (
    <Authorized>
      <div className="container mx-auto p-4 relative">
        <DashboardHeader />
        <ShoppingListView groupId={groupId} />
      </div>
    </Authorized>
  );
}
