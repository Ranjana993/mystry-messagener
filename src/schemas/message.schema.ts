import { z } from "zod"


export const messageSchemaVerification = z.object({
  content: z
    .string()
    .min(10, { message: "content must be atleast of 10 characters " })
    .max(10, { message: "content can be of 300 charachter no longer than that  " })
})