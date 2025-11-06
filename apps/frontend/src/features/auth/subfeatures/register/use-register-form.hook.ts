"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterDto } from "@repo/schemas";
import { useRegisterMutation } from "@/features/auth/subfeatures/register/use-register-mutation.hook";

export function useRegisterForm() {
  const { mutate, isPending } = useRegisterMutation();

  const form = useForm<RegisterDto>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(values: RegisterDto) {
    mutate(values);
  }

  return { form, onSubmit, isPending };
}
