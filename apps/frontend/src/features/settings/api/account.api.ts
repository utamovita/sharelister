import { apiClient } from "@/shared/lib/api/api-client";
import { API_PATHS } from "@repo/config";
import { UserProfile } from "@repo/types";
import { UpdateUserDto } from "@repo/schemas";

export const accountApi = {
  getProfile: async () => {
    const response = await apiClient.get<UserProfile>(
      `${API_PATHS.account}/profile`,
    );
    return response.data;
  },
  updateProfile: async (data: UpdateUserDto) => {
    const response = await apiClient.patch<UserProfile>(
      API_PATHS.account,
      data,
    );
    return response.data;
  },
};
