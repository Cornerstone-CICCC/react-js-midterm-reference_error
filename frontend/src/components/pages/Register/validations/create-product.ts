import { z } from "zod";

export const createProductSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    category: z.string().min(1, "Password is required"),
    price: z.string().transform((val) => {
      const parsedValue = Number.parseFloat(val);
      if (Number.isNaN(parsedValue)) {
        throw new Error("Price must be a number");
      }
      return parsedValue;
    }),
    condition: z.string().min(1, "Condition is required"),
  })
  .superRefine((data, ctx) => {
    if (data.title.length < 4) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Title must be at least 4 characters long",
      });
    }

    if (data.description.length < 10) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Description must be at least 10 characters long",
      });
    }
    if (data.price <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Price must be greater than 0",
      });
    }
  });
