"use client";

import { useQuery } from "@tanstack/react-query";
import { accountApi } from "../api/account.api";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: accountApi.getProfile,
  });
}
