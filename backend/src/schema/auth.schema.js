import { z } from "zod";

export const registerSchema = z.object({
  fname: z.string().min(1, "First name is required").trim(),
  lname: z.string().min(1, "Last name is required").trim(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
