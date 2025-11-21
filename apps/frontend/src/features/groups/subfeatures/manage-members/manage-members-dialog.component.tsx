import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/ui/dialog";
import { GroupWithDetails, GroupMember } from "@repo/types";
import { CreateInvitationForm } from "@/features/groups/subfeatures/invitations/create-invitation-form.component";

import { useRemoveMember } from "@/features/groups/subfeatures/manage-members/use-remove-member.hook";
import { useUpdateMemberRole } from "@/features/groups/subfeatures/manage-members/use-update-member-role.hook";
import { Button } from "@/shared/ui/button";
import { Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import type { Role } from "@repo/types";
import { useTranslation } from "react-i18next";
import { ROLES } from "@repo/types";
import { trpc } from "@repo/trpc/react";

type ManageMembersDialogProps = {
  group: GroupWithDetails;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ManageMembersDialog({
  group,
  open,
  onOpenChange,
}: ManageMembersDialogProps) {
  const { t } = useTranslation("common");
  const { data: profile } = trpc.account.getProfile.useQuery();
  const { mutate: removeMember, isPending: isRemoving } = useRemoveMember();
  const { mutate: updateRole, isPending: isUpdating } = useUpdateMemberRole();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("group.manageMembers.title")}</DialogTitle>
          <DialogDescription>
            {t("group.group")}: {group.name}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 mt-4">
          <div>
            <h3 className="font-semibold mb-2 text-sm">
              {t("group.manageMembers.currentMembers")}
            </h3>
            <ul className="space-y-2">
              {group.members.map(({ user, role }: GroupMember) => (
                <li
                  key={user.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span>{user.name}</span>
                  <div className="flex items-center gap-2">
                    <Select
                      value={role}
                      onValueChange={(newRole) =>
                        updateRole({
                          groupId: group.id,
                          memberId: user.id,
                          role: newRole as Role,
                        })
                      }
                      disabled={user.id === profile?.data.id || isUpdating}
                    >
                      <SelectTrigger className="w-[110px] h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ROLES.ADMIN}>
                          {t("role.admin")}
                        </SelectItem>
                        <SelectItem value={ROLES.USER}>
                          {t("role.user")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        removeMember({ groupId: group.id, memberId: user.id })
                      }
                      disabled={user.id === profile?.data.id || isRemoving}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-2 text-sm">
              {t("invitation.dialog.title")}
            </h3>
            <CreateInvitationForm groupId={group.id} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
