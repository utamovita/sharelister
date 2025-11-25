import { render, screen, waitFor, renderHook } from "@testing-library/react";
import { CreateGroupForm } from "./create-group-form.component";
import { useCreateGroup } from "./use-create-group.hook";
import { useForm } from "react-hook-form";
import { CreateGroupDto, createGroupSchema } from "@repo/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";

jest.mock("./use-create-group.hook");

const mockUseCreateGroup = useCreateGroup as jest.Mock;

describe("CreateGroupForm", () => {
  const mockMutate = jest.fn();

  const setupMockHook = (isPending = false) => {
    const { result } = renderHook(() =>
      useForm<CreateGroupDto>({
        resolver: zodResolver(createGroupSchema),
        defaultValues: { name: "" },
      }),
    );

    mockUseCreateGroup.mockReturnValue({
      form: result.current,
      createGroupMutation: {
        mutate: mockMutate,
        isPending: isPending,
      },
    });
  };

  beforeEach(() => {
    mockMutate.mockClear();
    setupMockHook(false);
  });

  it("should render the form elements correctly", () => {
    render(<CreateGroupForm />);
    expect(
      screen.getByPlaceholderText("common:group.namePlaceholder"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "common:create" }),
    ).toBeInTheDocument();
  });

  it("should call mutate with correct data on successful submission", async () => {
    render(<CreateGroupForm />);
    const groupName = "My New Test Group";

    await userEvent.type(
      screen.getByPlaceholderText("common:group.namePlaceholder"),
      groupName,
    );
    await userEvent.click(
      screen.getByRole("button", { name: "common:create" }),
    );

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({ name: groupName });
    });
  });

  it("should display a validation error for an empty name", async () => {
    render(<CreateGroupForm />);

    await userEvent.click(
      screen.getByRole("button", { name: "common:create" }),
    );

    const errorMessage = await screen.findByText("validation:required");
    expect(errorMessage).toBeInTheDocument();
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("should display a validation error for a name that is too short", async () => {
    render(<CreateGroupForm />);

    await userEvent.type(
      screen.getByPlaceholderText("common:group.namePlaceholder"),
      "a",
    );
    await userEvent.click(
      screen.getByRole("button", { name: "common:create" }),
    );

    const errorMessage = await screen.findByText("validation:name.minLength_3");
    expect(errorMessage).toBeInTheDocument();
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("should disable the input and button when isPending is true", () => {
    setupMockHook(true);

    render(<CreateGroupForm />);

    expect(
      screen.getByPlaceholderText("common:group.namePlaceholder"),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "common:create" }),
    ).toBeDisabled();
  });

  it("should have no accessibility violations", async () => {
    const { container } = render(<CreateGroupForm />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
