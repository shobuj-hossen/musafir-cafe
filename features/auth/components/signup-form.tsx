"use client"

import Link from "next/link"
import { useAppForm } from "@/components/form/use-app-form"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup } from "@/components/ui/field"
import { toast } from "@/components/ui/toast"
import { authClient } from "@/lib/auth-client"
import { signupSchema, SignupSchema } from "../schemas"
import Image from "next/image"
import { generateAvatarUrl } from "@/lib/generate-avatar"

export function SignupForm() {
  const defaultValues: SignupSchema = {
    name: "",
    email: "",
    password: "",
  }

  const form = useAppForm({
    defaultValues,
    validators: {
      onSubmit: signupSchema,
      onChange: signupSchema,
    },
    onSubmit: async ({ value }) => {
      const res = await authClient.signUp.email({
        ...value,
        callbackURL: "/dashboard/overviews",
      })

      if (res.data) {
        toast.add({
          type: "success",
          title: "Welcome! Check your inbox",
          description: "We've sent a verification link to your email address.",
        })
        form.reset()
      } else {
        toast.add({
          type: "error",
          title: "Sign up failed",
          description:
            res.error?.message || "Something went wrong. Please try again.",
        })
      }
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
      </CardHeader>

      <div></div>
      <CardContent>
        <form
          id="signup-form"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.AppField
              name="name"
              children={(field) => (
                <field.TextField label="Name" placeholder="Enter your name" />
              )}
            />

            <form.AppField
              name="email"
              children={(field) => (
                <field.TextField
                  label="Email Address"
                  placeholder="Enter your email address"
                />
              )}
            />

            <form.AppField
              name="password"
              children={(field) => (
                <field.PasswordField label="Password" placeholder="********" />
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        <form.AppForm>
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isPending) => (
              <Field>
                <Button
                  className="w-full"
                  disabled={isPending}
                  form="signup-form"
                  type="submit"
                >
                  {isPending ? "Creating account..." : "Create Account"}
                </Button>
              </Field>
            )}
          </form.Subscribe>
        </form.AppForm>

        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
