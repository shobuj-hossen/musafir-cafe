"use client"

import { useAppForm } from "@/components/form/use-app-form"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { toast } from "@/components/ui/toast"
import { authClient } from "@/lib/auth-client"
import { generateAvatarUrl } from "@/lib/generate-avatar"
import { createSlug } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { z } from "zod"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type AnotherLocationDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

export function AnotherLocationDialog({
  open,
  setOpen,
}: AnotherLocationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Location</DialogTitle>
          <DialogDescription>
            Add another restaurant location to your organization. You can switch
            between locations anytime.
          </DialogDescription>
        </DialogHeader>

        <AnotherLocationForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

const locationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Location name must be at least 2 characters")
    .max(50, "Location name cannot exceed 50 characters"),
})

type LocationSchema = z.infer<typeof locationSchema>

type AnotherLocationFormProps = {
  onSuccess?: () => void
}

export function AnotherLocationForm({ onSuccess }: AnotherLocationFormProps) {
  const router = useRouter()

  const form = useAppForm({
    defaultValues: {
      name: "",
    } satisfies LocationSchema,

    validators: {
      onSubmit: locationSchema,
      onChange: locationSchema,
    },

    onSubmit: async ({ value }) => {
      const name = value.name.trim()
      const slug = createSlug(name)
      const logo = generateAvatarUrl(name, "shape-grid")

      const newOrg = await authClient.organization.create({
        name,
        slug,
        logo,
        keepCurrentActiveOrganization: false,
      })

      if (newOrg.error || !newOrg.data) {
        toast.add({
          type: "error",
          title: "Unable to create location",
          description: "Please try again.",
        })
        return
      }

      const activateOrganization = () =>
        authClient.organization.setActive({
          organizationId: newOrg.data.id,
        })

      let session = await activateOrganization()

      if (session.error) {
        session = await activateOrganization()
      }

      if (session.error) {
        toast.add({
          type: "warning",
          title: "Location created, but not activated",
          description:
            "Please select your new location from the location switcher.",
        })

        form.reset()
        onSuccess?.()
        router.refresh()
        return
      }

      form.reset()

      toast.add({
        type: "success",
        title: "Location created",
        description: `${name} has been successfully added.`,
      })

      onSuccess?.()
      router.refresh()
    },
  })

  return (
    <form
      id="another-location-form"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="space-y-5"
    >
      <form.AppField
        name="name"
        children={(field) => (
          <field.TextField
            label="Location Name"
            placeholder="e.g. Downtown Branch"
          />
        )}
      />

      {/* Live Avatar Preview */}
      <div className="rounded-lg border bg-muted/30 p-4">
        <p className="mb-3 text-sm font-medium">Location Avatar Preview</p>

        <form.Subscribe selector={(state) => state.values.name}>
          {(name) => {
            const trimmedName = name.trim()

            const avatarUrl = trimmedName
              ? generateAvatarUrl(trimmedName, "shape-grid")
              : undefined

            return (
              <div className="flex items-center gap-3">
                <Avatar className="size-16 rounded-xl border bg-background">
                  <AvatarImage
                    src={avatarUrl}
                    alt={trimmedName || "Location avatar"}
                  />
                  <AvatarFallback className="rounded-xl text-lg font-semibold">
                    {trimmedName ? trimmedName.slice(0, 1).toUpperCase() : "?"}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {trimmedName || "Your location name"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Avatar generated automatically
                  </p>
                </div>
              </div>
            )
          }}
        </form.Subscribe>
      </div>

      <form.AppForm>
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isPending) => (
            <Field>
              <Button
                form={"another-location-form"}
                type="submit"
                className="w-full"
                disabled={isPending}
              >
                {isPending ? "Creating..." : "Create Location"}
              </Button>
            </Field>
          )}
        </form.Subscribe>
      </form.AppForm>
    </form>
  )
}
