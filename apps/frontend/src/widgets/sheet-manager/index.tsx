"use client";

import { SHEET_TYPES, useUiStore } from "@/shared/store/ui.store";
import { SettingsSheet } from "@/features/settings/components/settings-sheet.component";

export function SheetManager() {
  const { sheetState, closeSheet } = useUiStore();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeSheet();
    }
  };

  const commonProps = {
    open: !!sheetState.type,
    onOpenChange: handleOpenChange,
  };

  if (!sheetState.type) {
    return null;
  }

  switch (sheetState.type) {
    case SHEET_TYPES.SETTINGS:
      return <SettingsSheet {...commonProps} />;
    default:
      return null;
  }
}
