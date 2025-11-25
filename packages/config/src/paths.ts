export const APP_PATHS = {
  home: "/",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  dashboardGroup: (groupId: string) => `/dashboard/${groupId}`,
  verifyEmail: "/auth/verify-email",
  forgotPassword: "/auth/forgot-password",
  resetPassword: "/auth/reset-password",
};
