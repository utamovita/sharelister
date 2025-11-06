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

export const API_PATHS = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
    verifyEmail: "/auth/verify-email",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
  },
  account: "/account",
  groups: "/groups",
  shoppingList: (groupId: string) => `/groups/${groupId}/items`,
  invitations: {
    received: "/invitations/received",
    accept: (invitationId: string) => `/invitations/${invitationId}/accept`,
    decline: (invitationId: string) => `/invitations/${invitationId}/decline`,
    groupInvitations: (groupId: string) => `/groups/${groupId}/invitations`,
  },
};
