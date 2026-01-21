import z from "zod";

export const validators = {
  fullname: z.string().min(1, "Full name is required"),
  email: z.email("Invalid email address"),
  phone: z
    .string()
    .min(6, "Enter a valid phone number")
    .regex(/^\+?[0-9 ]+$/, "Enter a valid phone number"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(32, "Password must be at most 32 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,32}$/,
      "include at least one uppercase, lowercase, number and special character"
    ),
};
