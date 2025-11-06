import { render, screen, renderHook, waitFor } from "@testing-library/react";
import { useForm } from "react-hook-form";
import LoginForm from "./login-form.component";
import { useLoginForm } from "./use-login-form.hook";
import { loginSchema, type LoginDto } from "@repo/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { useSearchParams } from "next/navigation";

jest.mock("./use-login-form.hook");

const mockUseLoginForm = useLoginForm as jest.Mock;
const mockUseSearchParams = useSearchParams as jest.Mock;
describe("LoginForm", () => {
  const mockSubmit = jest.fn();

  beforeEach(() => {
    mockSubmit.mockClear();

    const { result } = renderHook(() =>
      useForm<LoginDto>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
      }),
    );

    mockUseLoginForm.mockReturnValue({
      form: result.current,
      onSubmit: mockSubmit,
      isPending: false,
    });

    mockUseSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    });
  });

  it("should render all form elements correctly", () => {
    render(<LoginForm />);

    expect(
      screen.getByRole("heading", { name: "auth.loginTitle" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("formFields.email")).toBeInTheDocument();
    expect(screen.getByLabelText("formFields.password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "auth.loginTitle" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "auth.registerTitle" }),
    ).toBeInTheDocument();
  });

  it("should call onSubmit with the correct values when form is submitted", async () => {
    render(<LoginForm />);

    await userEvent.type(
      screen.getByLabelText("formFields.email"),
      "test@example.com",
    );
    await userEvent.type(
      screen.getByLabelText("formFields.password"),
      "password123",
    );
    await userEvent.click(
      screen.getByRole("button", { name: "auth.loginTitle" }),
    );

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(
        {
          email: "test@example.com",
          password: "password123",
        },
        expect.anything(),
      );
    });
  });

  it("should display an error message for an invalid email", async () => {
    render(<LoginForm />);

    await userEvent.type(
      screen.getByLabelText("formFields.email"),
      "invalid-email",
    );
    await userEvent.type(
      screen.getByLabelText("formFields.password"),
      "P@ssw0rd!",
    );
    await userEvent.click(
      screen.getByRole("button", { name: "auth.loginTitle" }),
    );

    const errorMessage = await screen.findByText("validation:email.invalid");
    expect(errorMessage).toBeInTheDocument();
  });

  it("should display an error message for an empty password", async () => {
    render(<LoginForm />);

    await userEvent.type(
      screen.getByLabelText("formFields.email"),
      "johndoe@example.com",
    );
    await userEvent.clear(screen.getByLabelText("formFields.password"));
    await userEvent.click(
      screen.getByRole("button", { name: "auth.loginTitle" }),
    );

    const errorMessage = await screen.findByText(
      "validation:password.required",
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it("should disable the submit button when isPending is true", () => {
    const { result } = renderHook(() => useForm<LoginDto>());

    mockUseLoginForm.mockReturnValue({
      form: result.current,
      onSubmit: jest.fn(),
      isPending: true,
    });

    render(<LoginForm />);

    const submitButton = screen.getByRole("button", {
      name: "auth.loginTitle",
    });
    expect(submitButton).toBeDisabled();
  });

  it("should have no accessibility violations", async () => {
    const { container } = render(<LoginForm />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should display an alert when 'error' param is present", () => {
    mockUseSearchParams.mockReturnValue({
      get: (key: string) => (key === "error" ? "provider_mismatch" : null),
    });

    render(<LoginForm />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(
      screen.getByText("auth.error.providerMismatchTitle"),
    ).toBeInTheDocument();
  });
});
