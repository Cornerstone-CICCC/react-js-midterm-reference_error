import { z } from "zod";

export const registerUserSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    nickname: z.string().min(1, "Nickname is required"),
    password: z.string().min(1, "Password is required"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .superRefine((data, ctx) => {
    if (data.nickname.length < 4) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Nickname must be at least 4 characters long",
      });
    }

    if (data.password.length < 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password must be at least 8 characters long",
        path: ["password"],
      });
    }

    if (!/[A-Z]/.test(data.password)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password must contain at least one uppercase letter",
        path: ["password"],
      });
    }

    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });
