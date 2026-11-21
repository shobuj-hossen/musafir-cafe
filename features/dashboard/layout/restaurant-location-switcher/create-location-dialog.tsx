"use client"

import { useAppForm } from "@/components/form/use-app-form"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field } from "@/components/ui/field"
import { toast } from "@/components/ui/toast"
import { generateAvatarUrl } from "@/lib/generate-avatar"
import { z } from "zod"

const locationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Location name must be at least 2 characters")
    .max(50, "Location name cannot exceed 50 characters"),
})

type LocationSchema = z.infer<typeof locationSchema>

export type CreateLocationInput = {
  name: string
  avatarUrl: string
}

type CreateLocationDialogProps = {
  cancelDisabled?: boolean
}

export function CreateLocationDialog({
  cancelDisabled = false,
}: CreateLocationDialogProps) {
  const defaultValues: LocationSchema = {
    name: "",
  }

  const form = useAppForm({
    defaultValues,
    validators: {
      onSubmit: locationSchema,
      onChange: locationSchema,
    },
    onSubmit: async ({ value }) => {
      const name = value.name.trim()

      const avatarUrl = generateAvatarUrl(name, "shape-grid")

      try {
        toast.add({
          type: "success",
          title: "Location created",
          description: `${name} has been successfully added.`,
        })

        form.reset()
      } catch (error) {
        console.error("Create location error:", error)

        toast.add({
          type: "error",
          title: "Something went wrong",
          description: "Unable to create location. Please try again.",
        })
      }
    },
  })

  return (
    <Dialog>
      <DialogTrigger render={<Button>Click me</Button>}></DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Restaurant Location</DialogTitle>
          <DialogDescription>
            Create a new restaurant branch by providing its location name.
          </DialogDescription>
        </DialogHeader>

        <form
          id="create-location-form"
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
                        {trimmedName
                          ? trimmedName.slice(0, 1).toUpperCase()
                          : "?"}
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
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" disabled={cancelDisabled}>
            Cancel
          </Button>

          <form.AppForm>
            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(isPending) => (
                <Field>
                  <Button
                    type="submit"
                    form="create-location-form"
                    disabled={isPending}
                  >
                    {isPending ? "Creating..." : "Create Location"}
                  </Button>
                </Field>
              )}
            </form.Subscribe>
          </form.AppForm>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
