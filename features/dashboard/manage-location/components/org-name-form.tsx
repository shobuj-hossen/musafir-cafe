"use client"

import { useAppForm } from "@/components/form/use-app-form"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { authClient } from "@/lib/auth-client"
import { Loader2, Save } from "lucide-react"
import { locationNameSchema, LocationNameSchema } from "../schema"
import { Location } from "./location-settings"

export function OrganizationNameForm({ location }: { location: Location }) {
  const form = useAppForm({
    defaultValues: {
      name: location.name,
    } satisfies LocationNameSchema,

    validators: {
      onSubmit: locationNameSchema,
      onChange: locationNameSchema,
    },

    onSubmit: async ({ value }) => {
      const name = value.name.trim()

      if (name === location.name) return

      const { error } = await authClient.organization.update({
        organizationId: location.id,
        data: { name },
      })

      if (error) {
        toast.add({
          type: "error",
          title: "Unable to update location",
          description: "Please try again.",
        })
        return
      }

      toast.add({
        type: "success",
        title: "Location updated",
        description: "Your location name has been updated.",
      })
    },
  })

  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-semibold">General</h2>
        <p className="text-sm text-muted-foreground">
          Update your restaurant location information.
        </p>
      </div>

      <div className="rounded-xl border p-5">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <form.AppField
            name="name"
            children={(field) => (
              <field.TextField
                label="Location name"
                placeholder="e.g. Downtown Branch"
              />
            )}
          />

          <form.AppForm>
            <form.Subscribe
              selector={(state) => ({
                isSubmitting: state.isSubmitting,
                name: state.values.name,
              })}
            >
              {({ isSubmitting, name }) => (
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isSubmitting || name.trim() === location.name}
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Save />
                    )}
                    {isSubmitting ? "Saving..." : "Save changes"}
                  </Button>
                </div>
              )}
            </form.Subscribe>
          </form.AppForm>
        </form>
      </div>
    </section>
  )
}
