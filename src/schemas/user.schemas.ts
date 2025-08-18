import { z } from "zod";

export const registerUserSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(4, { message: "Password must be at least 4 characters long" }),
});

export const loginUserSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(4, { message: "Password must be at least 4 characters long" }),
});

export const profileUpdateSchema = z.object({
  formInput: z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
  }),
});

export type RegisterUser = z.infer<typeof registerUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type ProfileUpdate = z.infer<typeof profileUpdateSchema>;
