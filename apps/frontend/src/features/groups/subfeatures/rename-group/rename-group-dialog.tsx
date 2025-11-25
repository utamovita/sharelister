import { Button } from "@/shared/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { useForm } from "react-hook-form";
import { useRenameGroup } from "@/features/groups/subfeatures/rename-group/use-rename-group.hook";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { GroupWithDetails } from "@repo/types";
import { UpdateGroupDto } from "@repo/schemas";

type RenameGroupDialogProps = {
  group: GroupWithDetails;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function RenameGroupDialog({
  group,
  open,
  onOpenChange,
}: RenameGroupDialogProps) {
  const { renameGroupMutation, form } = useRenameGroup();
  const { t } = useTranslation("common");

  const onSubmit = (data: UpdateGroupDto) => {
    renameGroupMutation.mutate({ groupId: group.id, data });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("group.changeNameDialog.title")}</DialogTitle>
          <DialogDescription>
            {t("group.changeNameDialog.description")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("group.changeNameDialog.newName")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        "group.changeNameDialog.newNamePlaceholder",
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              isLoading={renameGroupMutation.isPending}
            >
              {t("group.changeNameDialog.save")}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
