import { create } from "zustand";
import type { GroupWithDetails } from "@repo/types";
import type { Group } from "@repo/database";

export const DIALOG_TYPES = {
  MANAGE_MEMBERS: "manage-members",
  RENAME_GROUP: "rename-group",
  DELETE_GROUP: "delete-group",
  CREATE_GROUP: "create-group",
  DELETE_ACCOUNT: "delete-account",
} as const;

export const SHEET_TYPES = {
  SETTINGS: "settings",
} as const;

type DialogType = (typeof DIALOG_TYPES)[keyof typeof DIALOG_TYPES];
type SheetType = (typeof SHEET_TYPES)[keyof typeof SHEET_TYPES];

export type DialogPayload = {
  [DIALOG_TYPES.MANAGE_MEMBERS]: { group: GroupWithDetails };
  [DIALOG_TYPES.RENAME_GROUP]: { group: Group };
  [DIALOG_TYPES.DELETE_GROUP]: { group: Group };
  [DIALOG_TYPES.CREATE_GROUP]: Record<string, never>;
  [DIALOG_TYPES.DELETE_ACCOUNT]: Record<string, never>;
};

export type SheetPayload = {
  [SHEET_TYPES.SETTINGS]: Record<string, never>;
};

type DialogState =
  | {
      [K in DialogType]: {
        type: K;
        props: DialogPayload[K];
      };
    }[DialogType]
  | { type: null; props: Record<string, never> };

type SheetState =
  | {
      [K in SheetType]: {
        type: K;
        props: SheetPayload[K];
      };
    }[SheetType]
  | { type: null; props: Record<string, never> };

type UiStore = {
  dialogState: DialogState;
  openDialog: <T extends DialogType>(type: T, props: DialogPayload[T]) => void;
  closeDialog: () => void;

  sheetState: SheetState;
  openSheet: <T extends SheetType>(type: T, props: SheetPayload[T]) => void;
  closeSheet: () => void;

  isPageTransitioning: boolean;
  setPageTransitioning: (isLoading: boolean) => void;
};

export const useUiStore = create<UiStore>((set) => ({
  dialogState: {
    type: null,
    props: {},
  },
  openDialog: (type, props) => {
    set({ dialogState: { type, props } as DialogState });
  },
  closeDialog: () => set({ dialogState: { type: null, props: {} } }),

  sheetState: {
    type: null,
    props: {},
  },
  openSheet: (type, props) => {
    set({ sheetState: { type, props } as SheetState });
  },
  closeSheet: () => set({ sheetState: { type: null, props: {} } }),

  isPageTransitioning: false,
  setPageTransitioning: (isLoading) => set({ isPageTransitioning: isLoading }),
}));
