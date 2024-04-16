import { z } from "zod"

export const usernameValidation = z
  .string()
  .min(5, "username must be at least 5 characters")
  .max(10, "username must be at max 10 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters")


export const signupSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "invalid email adress" }),
  password: z.string().min(6, { message: "password mut be atleast 6 carachter" })
})





