import z from "zod"

export const locationNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Location name must be at least 2 characters")
    .max(50, "Location name cannot exceed 50 characters"),
})

export type LocationNameSchema = z.infer<typeof locationNameSchema>
