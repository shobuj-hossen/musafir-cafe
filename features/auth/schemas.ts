import { z } from "zod"

export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Name must be 50 characters or fewer." }),
  email: z

    .email({ message: "Please enter a valid email address." })
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .max(64, { message: "Password must be 64 characters or fewer." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    }),
})

// Export the inferred TypeScript type
export type SignupSchema = z.infer<typeof signupSchema>

export const signinSchema = z.object({
  email: z
    .email({ message: "Please enter a valid email address." })
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(1, { message: "Password is required." })
    .max(64, { message: "Password must be 64 characters or fewer." }),
})

// Export the inferred TypeScript type
export type SigninSchema = z.infer<typeof signinSchema>
