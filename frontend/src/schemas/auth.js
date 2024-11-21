import { z } from "zod";

export const registerSchema = z
  .object({
    username: z
      .string()
      .regex(/^[a-zA-Z0-9]+$/, "Username can only contain letters and numbers")
      .min(3, "Username can't be shorter than 3 characters")
      .max(150, "Username can't exceed 150 charcaters"),
    password: z
      .string()
      .min(8, "Password can't be shorter than 8 characters")
      .max(128, "Password can't exceed 128 characters"),
    re_password: z
      .string()
      .min(8, "Password can't be shorter than 8 characters")
      .max(128, "Password can't exceed 128 characters"),
    avatar: z.string().optional(),
  })
  .refine((data) => data.password === data.re_password, {
    message: "Password and Confirm Password do not match",
    path: ["re_password"],
  });

export const loginSchema = z.object({
  username: z
    .string()
    .min(3, "Username can't be shorter than 3 characters")
    .max(150, "Username can't exceed 150 charcaters"),
  password: z
    .string()
    .min(8, "Password can't be shorter than 8 characters")
    .max(128, "Password can't exceed 128 characters"),
});
