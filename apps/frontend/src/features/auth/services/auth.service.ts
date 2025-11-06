import { authApi } from "../api/auth.api";
import {
  type LoginDto,
  type RegisterDto,
  authResponseSchema,
} from "@repo/schemas";

export const authService = {
  login: async (values: LoginDto) => {
    const response = await authApi.login(values);
    const serverResponse = response.data;

    const validatedData = authResponseSchema.parse(serverResponse.data);

    return {
      ...serverResponse,
      data: validatedData,
    };
  },

  register: async (values: RegisterDto) => {
    const response = await authApi.register(values);
    return response.data;
  },
};
