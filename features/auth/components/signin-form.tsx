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
import { SigninSchema, signinSchema } from "../schemas"

export function SigninForm() {
  const defaultValues: SigninSchema = {
    email: "",
    password: "",
  }

  const form = useAppForm({
    defaultValues,
    validators: {
      onSubmit: signinSchema,
      onChange: signinSchema,
    },
    onSubmit: async ({ value }) => {
      const res = await authClient.signIn.email({
        ...value,
        callbackURL: "/dashboard/overviews",
      })

      if (res.data) {
        toast.add({
          type: "success",
          title: "Welcome back!",
          description: "You have successfully signed in.",
        })
      } else {
        toast.add({
          type: "error",
          title: "Sign in failed",
          description:
            res.error?.message || "Something went wrong. Please try again.",
        })
      }
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
      </CardHeader>

      <CardContent>
        <form
          id="signin-form"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
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

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
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
                  form="signin-form"
                  type="submit"
                >
                  {isPending ? "Signing in..." : "Sign In"}
                </Button>
              </Field>
            )}
          </form.Subscribe>
        </form.AppForm>

        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-primary hover:underline"
          >
            Create account
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
