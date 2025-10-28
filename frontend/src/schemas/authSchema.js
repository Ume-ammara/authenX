import z from "zod";

export const registerUserSchema = z.object({
  fullname: z.string().trim().min(3, "Full name must be at least 3 characters"),
  username: z.string().trim().min(3, "Username must be at least 3 characters"),
  email: z.email("Enter a valid email"),
  password: z.string().trim().min(6, "Password must be at least 6 characters"),
});

export const loginUserSchema = z.object({
  email: z.email({ message: "Enter a valid email" }),
  password: z.string().trim().min(6, "Password must be at least 6 characters"),
});
