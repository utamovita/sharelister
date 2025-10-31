import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useDeleteAccount } from "./use-delete-account.hook";

type DeleteAccountDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteAccountDialog({
  open,
  onOpenChange,
}: DeleteAccountDialogProps) {
  const { t } = useTranslation("common");
  const [inputValue, setInputValue] = useState("");
  const { mutate: deleteAccount, isPending } = useDeleteAccount();

  const confirmationPhrase = t(
    "settings.dangerZone.deleteAccountDialog.confirmationPhrase",
  );
  const isButtonDisabled = inputValue !== confirmationPhrase || isPending;

  const handleDelete = () => {
    if (!isButtonDisabled) {
      deleteAccount();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {t("settings.dangerZone.deleteAccountDialog.title")}
          </DialogTitle>
          <DialogDescription>
            {t("settings.dangerZone.deleteAccountDialog.description")}:
            <br />
            <strong className="text-destructive font-semibold my-2 block">
              &#34;{confirmationPhrase}&#34;
            </strong>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Label htmlFor="confirmation">{t("formFields.confirmation")}</Label>
          <Input
            id="confirmation"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            autoComplete="off"
            disabled={isPending}
          />
        </div>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isButtonDisabled}
          isLoading={isPending}
          className="w-full"
        >
          {t("settings.dangerZone.deleteAccountButton")}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
