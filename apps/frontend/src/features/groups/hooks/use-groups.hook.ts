"use client";

import { trpc } from "@repo/trpc/react";

export function useGroups() {
  const response = trpc.groups.getAll.useQuery();

  return response;
}
