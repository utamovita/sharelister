"use client";
import { trpc } from "@repo/trpc/react";

export function useReceivedInvitations() {
  return trpc.invitations.getReceived.useQuery();
}
