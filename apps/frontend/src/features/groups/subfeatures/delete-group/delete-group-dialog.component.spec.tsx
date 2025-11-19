import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { useDeleteGroup } from "./use-delete-group.hook";
import type { Group } from "@repo/database";
import { DIALOG_TYPES, useUiStore } from "@/shared/store/ui.store";
import { DialogManager } from "@/widgets/dialog-manager";
import { GroupWithDetails } from "@repo/types";

jest.mock("./use-delete-group.hook");
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: { groupName: string }) =>
      options ? `${key}_${options.groupName}` : key,
  }),
}));

const mockUseDeleteGroup = useDeleteGroup as jest.Mock;

const mockGroup: GroupWithDetails = {
  id: "group-123",
  name: "Test Group Name",
  itemCount: 5,
  currentUserRole: "ADMIN",
  members: [],
};

const TestBed = () => {
  const { openDialog } = useUiStore();
  return (
    <>
      <button
        onClick={() =>
          openDialog(DIALOG_TYPES.DELETE_GROUP, { group: mockGroup })
        }
      >
        Open Delete Dialog
      </button>
      <DialogManager />
    </>
  );
};

describe("DeleteGroupDialog", () => {
  const mockMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useUiStore.getState().closeDialog();

    mockUseDeleteGroup.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
  });

  it("should open the dialog and display group name when trigger is clicked", async () => {
    render(<TestBed />);

    await userEvent.click(
      screen.getByRole("button", { name: "Open Delete Dialog" }),
    );

    expect(
      await screen.findByRole("heading", { name: "group.delete" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("group.deleteGroupPrompt_Test Group Name"),
    ).toBeInTheDocument();
  });

  it("should call mutate with the correct group id when delete is confirmed", async () => {
    render(<TestBed />);

    await userEvent.click(
      screen.getByRole("button", { name: "Open Delete Dialog" }),
    );
    await userEvent.click(
      await screen.findByRole("button", { name: "yesDelete" }),
    );

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith("group-123");
    });
  });

  it("should disable the delete button when isPending is true", async () => {
    mockUseDeleteGroup.mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    });

    render(<TestBed />);

    await userEvent.click(
      screen.getByRole("button", { name: "Open Delete Dialog" }),
    );
    const deleteButton = await screen.findByRole("button", {
      name: "yesDelete",
    });

    expect(deleteButton).toBeDisabled();
  });

  it("should have no accessibility violations when open", async () => {
    render(<TestBed />);

    await userEvent.click(
      screen.getByRole("button", { name: "Open Delete Dialog" }),
    );

    // Dialog ma atrybut `role="dialog"`
    const dialog = await screen.findByRole("dialog");
    const results = await axe(dialog);

    expect(results).toHaveNoViolations();
  });
});
