import { renderHook, waitFor } from "@testing-library/react";
import { useRenameGroup } from "./use-rename-group.hook";
import { groupsApi } from "@/features/groups/api/groups.api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";
import { GroupWithDetails, ROLES, SuccessResponse } from "@repo/types";

jest.mock("../../api/groups.api");
jest.mock("sonner");
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockGroupsApi = groupsApi as jest.Mocked<typeof groupsApi>;

describe("useUpdateGroup", () => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call groupsApi.update and show success toast on success", async () => {
    const updateData = {
      groupId: "group-123",
      data: { name: "New Group Name" },
    };

    const mockResponse: SuccessResponse<GroupWithDetails> = {
      success: true,
      message: "group.changeNameDialog.success",
      data: {
        id: updateData.groupId,
        name: updateData.data.name,
        members: [],
        itemCount: 1,
        currentUserRole: ROLES.ADMIN,
      },
    };
    mockGroupsApi.update.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useRenameGroup(), { wrapper });

    result.current.mutate(updateData);

    await waitFor(() => {
      expect(mockGroupsApi.update).toHaveBeenCalledWith(updateData);
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "group.changeNameDialog.success",
      );
    });
  });
});
