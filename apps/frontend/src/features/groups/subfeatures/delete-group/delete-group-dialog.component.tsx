import { Button } from "@/shared/ui/button";
import { useDeleteGroup } from "./use-delete-group.hook";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { GroupWithDetails } from "@repo/types";

type DeleteGroupDialogProps = {
  group: GroupWithDetails;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteGroupDialog({
  group,
  open,
  onOpenChange,
}: DeleteGroupDialogProps) {
  const { mutate, isPending } = useDeleteGroup();
  const { t } = useTranslation("common");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("group.delete")}</DialogTitle>
          <DialogDescription>
            {t("group.deleteGroupPrompt", { groupName: group.name })}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="destructive"
            onClick={() => mutate({ groupId: group.id })}
            isLoading={isPending}
          >
            {t("yesDelete")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
