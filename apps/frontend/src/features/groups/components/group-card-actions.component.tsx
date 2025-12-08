"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { useTranslation } from "react-i18next";
import { GroupWithDetails, ROLES, Role } from "@repo/types";
import { DIALOG_TYPES, useUiStore } from "@/shared/store/ui.store";

function AdminOnly({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) {
  if (role !== ROLES.ADMIN) {
    return null;
  }

  return children;
}

type GroupCardActionsProps = {
  group: GroupWithDetails;
};

export function GroupCardActions({ group }: GroupCardActionsProps) {
  const { t } = useTranslation("common");
  const openDialog = useUiStore((state) => state.openDialog);

  if (group.currentUserRole !== ROLES.ADMIN) {
    return null;
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      className="relative z-10"
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-1 rounded-md hover:bg-accent">
            <MoreVertical className="h-5 w-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <AdminOnly role={group.currentUserRole}>
            <DropdownMenuItem
              onClick={() => openDialog(DIALOG_TYPES.RENAME_GROUP, { group })}
            >
              {t("group.changeName")}
            </DropdownMenuItem>
          </AdminOnly>
          <AdminOnly role={group.currentUserRole}>
            <DropdownMenuItem
              onClick={() => openDialog(DIALOG_TYPES.MANAGE_MEMBERS, { group })}
            >
              {t("group.manageMembers.title")}
            </DropdownMenuItem>
          </AdminOnly>
          <DropdownMenuItem
            onClick={() => openDialog(DIALOG_TYPES.LEAVE_GROUP, { group })}
          >
            {t("group.leave")}
          </DropdownMenuItem>
          <AdminOnly role={group.currentUserRole}>
            <DropdownMenuItem
              onClick={() => openDialog(DIALOG_TYPES.DELETE_GROUP, { group })}
              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              {t("group.delete")}
            </DropdownMenuItem>
          </AdminOnly>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
