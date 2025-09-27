import { z } from "zod";

export const registerSchema = z.object({
  fullname: z.string().trim().min(3, "Full name must be at least 3 characters"),
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().trim().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().trim().min(6, "Password must be at least 6 characters"),
});

export const forgotPasswordSchema = z.object({
  email: z.email("Invalid email address"),
});

export const verifyEmailSchema = z.object({
  token: z.string().nonempty("Token is required"),
});

