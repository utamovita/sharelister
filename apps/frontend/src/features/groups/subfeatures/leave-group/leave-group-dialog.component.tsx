import { Button } from "@/shared/ui/button";
import { useLeaveGroup } from "./use-leave-group.hook";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { GroupWithDetails } from "@repo/types";
import { trpc } from "@repo/trpc/react";

type LeaveGroupDialogProps = {
  group: GroupWithDetails;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function LeaveGroupDialog({
  group,
  open,
  onOpenChange,
}: LeaveGroupDialogProps) {
  const { mutate, isPending } = useLeaveGroup();
  const { data: profile } = trpc.account.getProfile.useQuery();

  const { t } = useTranslation("common");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("group.leave")}</DialogTitle>
          <DialogDescription>
            {t("group.leaveGroupPrompt", { groupName: group.name })}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="default"
            onClick={() =>
              mutate({ groupId: group.id, memberId: profile?.data.id! })
            }
            isLoading={isPending}
          >
            {t("yesLeave")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
