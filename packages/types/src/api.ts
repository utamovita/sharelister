import type { User, Invitation as PrismaInvitation } from "@repo/database";

export type TrpcSuccessResponse<T> = {
  success: true;
  data: T;
  message: string;
};

export const ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export type UserProfile = Omit<
  User,
  "passwordHash" | "provider" | "createdAt" | "updatedAt"
>;

export type GroupMember = {
  role: Role;
  user: {
    id: string;
    name: string | null;
  };
};

export type GroupWithDetails = {
  id: string;
  name: string;
  itemCount: number;
  currentUserRole: Role;
  members: GroupMember[];
};

export type Invitation = PrismaInvitation & {
  group: {
    id: string;
    name: string;
  };
  invitedByUser: {
    id: string;
    name: string | null;
  };
};
