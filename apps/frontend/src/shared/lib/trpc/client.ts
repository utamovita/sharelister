import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { type AppRouter } from "@repo/trpc";
import { useAuthStore } from "@/shared/store/auth.store";
import { env } from "@/shared/lib/env";

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${env.NEXT_PUBLIC_API_URL}/trpc`,
      headers() {
        const { accessToken } = useAuthStore.getState();
        if (!accessToken) {
          return {};
        }
        return {
          Authorization: `Bearer ${accessToken}`,
        };
      },
    }),
  ],
});
