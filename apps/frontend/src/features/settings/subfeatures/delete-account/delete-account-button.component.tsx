import { DIALOG_TYPES, useUiStore } from "@/shared/store/ui.store";
import { Button } from "@/shared/ui/button";
import { useTranslation } from "react-i18next";

function DeleteAccountButton() {
  const { t } = useTranslation("common");

  const { openDialog, closeSheet } = useUiStore();
  const handleDeleteClick = () => {
    closeSheet();
    openDialog(DIALOG_TYPES.DELETE_ACCOUNT, {});
  };

  return (
    <Button
      variant="destructive"
      className="w-full p-3"
      onClick={handleDeleteClick}
    >
      {t("settings.dangerZone.deleteAccountTitle")}
    </Button>
  );
}

export { DeleteAccountButton };
