import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { type AppRouter } from "@repo/trpc";
import { useAuthStore } from "@/shared/store/auth.store";
import { env } from "@/shared/lib/env";

async function refreshAuthToken(refreshToken: string): Promise<string> {
  const response = await fetch(
    `${env.NEXT_PUBLIC_API_URL}/trpc/auth.refreshToken`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    },
  );

  if (!response.ok) throw new Error("Refresh failed");

  const json = await response.json();
  const data = json.result.data.data;

  if (data?.accessToken && data?.refreshToken) {
    useAuthStore.getState().setTokens({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });
  }

  return data.accessToken;
}

// Queue for failed requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

const customFetch: typeof fetch = async (input, init) => {
  return fetch(input, init).then(async (response) => {
    if (response.status !== 401) {
      return response;
    }

    const { refreshToken, setTokens, logout } = useAuthStore.getState();

    if (!refreshToken) {
      logout();
      return response;
    }

    if (isRefreshing) {
      try {
        const newToken = await new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });

        const newHeaders = new Headers(init?.headers);
        newHeaders.set("authorization", `Bearer ${newToken}`);

        return fetch(input, { ...init, headers: newHeaders });
      } catch (err) {
        return response;
      }
    }

    isRefreshing = true;

    try {
      const newAccessToken = await refreshAuthToken(refreshToken);

      setTokens({
        accessToken: newAccessToken,
        refreshToken: refreshToken,
      });

      processQueue(null, newAccessToken);

      const newHeaders = new Headers(init?.headers);
      newHeaders.set("authorization", `Bearer ${newAccessToken}`);

      return fetch(input, { ...init, headers: newHeaders });
    } catch (error) {
      processQueue(error, null);
      logout();
      return response;
    } finally {
      isRefreshing = false;
    }
  });
};

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${env.NEXT_PUBLIC_API_URL}/trpc`,
      fetch: customFetch,
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
