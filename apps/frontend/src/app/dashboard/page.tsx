"use client";

import DashboardView from "@/widgets/dashboard/index.component";
import { Authorized } from "@/features/auth/components/authorized.component";
import { DashboardHeader } from "@/widgets/dashboard/dashboard-header.component";

export default function DashboardPage() {
  return (
    <Authorized>
      <DashboardView />
    </Authorized>
  );
}
