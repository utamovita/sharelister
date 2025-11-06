import { apiClient } from "@/shared/lib/api/api-client";
import {
  type LoginDto,
  type RegisterDto,
  AuthResponseType,
  ResetPasswordDto,
} from "@repo/schemas";
import { API_PATHS } from "@repo/config";

export const authApi = {
  login: async (values: LoginDto) => {
    return apiClient.post<AuthResponseType>(API_PATHS.auth.login, values);
  },
  register: async (values: RegisterDto) => {
    return apiClient.post<{ message: string }>(API_PATHS.auth.register, values);
  },
  logout: async () => {
    return apiClient.post<null>(API_PATHS.auth.logout, {});
  },
  refresh: async (refreshToken: string) => {
    return apiClient.post<AuthResponseType>(
      API_PATHS.auth.refresh,
      {},
      {
        headers: { Authorization: `Bearer ${refreshToken}` },
      },
    );
  },
  verifyEmail: async (token: string) => {
    return apiClient.get<AuthResponseType>(
      `${API_PATHS.auth.verifyEmail}?token=${token}`,
    );
  },
  forgotPassword: async (values: { email: string }) => {
    return apiClient.post(API_PATHS.auth.forgotPassword, values);
  },
  resetPassword: async (values: ResetPasswordDto) => {
    return apiClient.post(API_PATHS.auth.resetPassword, values);
  },
};
