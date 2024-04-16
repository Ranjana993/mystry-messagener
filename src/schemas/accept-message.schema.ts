import { z } from "zod"

export const acceptSchemaVerification = z.object({
  acceptMessage: z.boolean(),
})