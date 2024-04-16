import { z } from "zod"

export const signinSchemaVerification = z.object({
  identifier: z.string(),
  password: z.string(),
})