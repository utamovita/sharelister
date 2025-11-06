import { render, screen, renderHook, waitFor } from "@testing-library/react";
import { useForm } from "react-hook-form";
import RegisterForm from "./register-form.component";
import { useRegisterForm } from "./use-register-form.hook";
import { registerSchema, type RegisterDto } from "@repo/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";

jest.mock("./use-register-form.hook");

const mockUseRegisterForm = useRegisterForm as jest.Mock;

describe("RegisterForm", () => {
  const mockSubmit = jest.fn();

  beforeEach(() => {
    mockSubmit.mockClear();

    const { result } = renderHook(() =>
      useForm<RegisterDto>({
        resolver: zodResolver(registerSchema),
        defaultValues: { username: "", email: "", password: "" },
      }),
    );

    mockUseRegisterForm.mockReturnValue({
      form: result.current,
      onSubmit: mockSubmit,
      isPending: false,
    });
  });

  it("should render all form elements correctly", () => {
    render(<RegisterForm />);

    expect(
      screen.getByRole("heading", { name: "auth.registerTitle" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("formFields.username")).toBeInTheDocument();
    expect(screen.getByLabelText("formFields.email")).toBeInTheDocument();
    expect(screen.getByLabelText("formFields.password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "auth.registerTitle" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "auth.loginTitle" }),
    ).toBeInTheDocument();
  });

  it("should call onSubmit with the correct values when form is submitted", async () => {
    render(<RegisterForm />);

    await userEvent.type(
      screen.getByLabelText("formFields.username"),
      "JohnDoe",
    );
    await userEvent.type(
      screen.getByLabelText("formFields.email"),
      "test@example.com",
    );
    await userEvent.type(
      screen.getByLabelText("formFields.password"),
      "password123",
    );
    await userEvent.click(
      screen.getByRole("button", { name: "auth.registerTitle" }),
    );

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(
        {
          username: "JohnDoe",
          email: "test@example.com",
          password: "password123",
        },
        expect.anything(),
      );
    });
  });

  it("should display an error message for a short username", async () => {
    render(<RegisterForm />);

    await userEvent.type(screen.getByLabelText("formFields.username"), "Jo");
    await userEvent.type(
      screen.getByLabelText("formFields.email"),
      "test@example.com",
    );
    await userEvent.type(
      screen.getByLabelText("formFields.password"),
      "password123",
    );
    await userEvent.click(
      screen.getByRole("button", { name: "auth.registerTitle" }),
    );

    const errorMessage = await screen.findByText("validation:name.minLength_3");
    expect(errorMessage).toBeInTheDocument();
  });

  it("should display an error message for a short password", async () => {
    render(<RegisterForm />);

    await userEvent.type(
      screen.getByLabelText("formFields.username"),
      "JohnDoe",
    );
    await userEvent.type(
      screen.getByLabelText("formFields.email"),
      "test@example.com",
    );
    await userEvent.type(screen.getByLabelText("formFields.password"), "12345");
    await userEvent.click(
      screen.getByRole("button", { name: "auth.registerTitle" }),
    );

    const errorMessage = await screen.findByText(
      "validation:password.minLength_8",
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it("should disable the submit button when isPending is true", () => {
    const { result } = renderHook(() => useForm<RegisterDto>());

    mockUseRegisterForm.mockReturnValue({
      form: result.current,
      onSubmit: jest.fn(),
      isPending: true,
    });

    render(<RegisterForm />);

    const submitButton = screen.getByRole("button", {
      name: "auth.registerTitle",
    });
    expect(submitButton).toBeDisabled();
  });

  it("should have no accessibility violations", async () => {
    const { container } = render(<RegisterForm />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
