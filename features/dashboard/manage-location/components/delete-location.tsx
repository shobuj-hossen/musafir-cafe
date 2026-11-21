"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast"
import { authClient } from "@/lib/auth-client"
import { Loader2, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { LocationSettingsProps } from "./location-settings"

const DELETE_CONFIRMATION = "Remove this location"

export function DeleteLocationSection({
  location,
  locations,
}: LocationSettingsProps) {
  const router = useRouter()
  const [confirmation, setConfirmation] = useState("")
  const [isPending, startTransition] = useTransition()

  const canDelete = confirmation === DELETE_CONFIRMATION

  const handleDelete = () => {
    if (!canDelete || isPending) return

    startTransition(async () => {
      const { error } = await authClient.organization.delete({
        organizationId: location.id,
      })

      if (error) {
        toast.add({
          type: "error",
          title: "Unable to remove location",
          description: "Please try again.",
        })
        return
      }

      // Find another location to activate.
      const nextOrganization = locations.find((item) => item.id !== location.id)

      if (nextOrganization) {
        const { error: activationError } =
          await authClient.organization.setActive({
            organizationId: nextOrganization.id,
          })

        if (activationError) {
          toast.add({
            type: "warning",
            title: "Location removed",
            description:
              "Your location was removed, but the next location could not be activated.",
          })

          router.replace("/dashboard")
          router.refresh()
          return
        }

        toast.add({
          type: "success",
          title: "Location removed",
          description: "Your location has been successfully removed.",
        })

        router.replace("/dashboard/overviews")
        router.refresh()
        return
      }

      // No locations remain.
      await authClient.organization.setActive({
        organizationId: null,
      })

      toast.add({
        type: "success",
        title: "Location removed",
        description: "Your location has been successfully removed.",
      })

      router.replace("/onboarding")
      router.refresh()
    })
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-semibold text-destructive">Danger Zone</h2>
        <p className="text-sm text-muted-foreground">
          Irreversible actions that affect this restaurant location.
        </p>
      </div>

      <div className="space-y-4 rounded-xl border border-destructive/30 p-5">
        <div className="space-y-1">
          <h3 className="font-medium">Remove this location</h3>
          <p className="text-sm text-muted-foreground">
            This will permanently delete{" "}
            <span className="font-medium text-foreground">{location.name}</span>
            . This action cannot be undone.
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm">
            Type{" "}
            <span className="font-semibold select-all">
              {DELETE_CONFIRMATION}
            </span>{" "}
            to confirm.
          </p>

          <Input
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            placeholder={DELETE_CONFIRMATION}
            autoComplete="off"
            disabled={isPending}
          />
        </div>

        <div className="flex justify-end">
          <Button
            variant="destructive"
            size="sm"
            disabled={!canDelete || isPending}
            onClick={handleDelete}
          >
            {isPending ? <Loader2 className="animate-spin" /> : <Trash2 />}
            {isPending ? "Removing..." : "Remove location"}
          </Button>
        </div>
      </div>
    </section>
  )
}
