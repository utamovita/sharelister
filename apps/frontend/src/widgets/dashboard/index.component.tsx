"use client";

import { GroupsPanel } from "@/widgets/dashboard/groups-panel.component";
import { DashboardHeader } from "@/widgets/dashboard/dashboard-header.component";

export default function DashboardView() {
  return (
    <div className="container mx-auto p-4 grid md:grid-cols-3 gap-8">
      <aside className="md:col-span-3">
        <DashboardHeader />
        <GroupsPanel />
      </aside>
    </div>
  );
}
