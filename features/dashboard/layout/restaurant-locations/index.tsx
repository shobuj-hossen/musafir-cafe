"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronsUpDown, MapPin, Plus, Settings2 } from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { toast } from "@/components/ui/toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DashboardInitialData } from "../types"
import { AnotherLocationDialog } from "./another-location-dialog"

type RestaurantLocationsProps = {
  data: DashboardInitialData
}

export default function RestaurantLocations({
  data,
}: RestaurantLocationsProps) {
  const router = useRouter()

  const [openAnotherLocationDialog, setOpenAnotherLocationDialog] =
    useState(false)
  const [isPending, startTransition] = useTransition()

  const { organizations, activeOrganization } = data

  const otherLocations = organizations.filter(
    (organization) => organization.id !== activeOrganization?.id
  )

  const handleLocationChange = (organizationId: string) => {
    if (organizationId === activeOrganization?.id || isPending) {
      return
    }

    startTransition(async () => {
      const { error } = await authClient.organization.setActive({
        organizationId,
      })

      if (error) {
        toast.add({
          type: "error",
          title: "Unable to switch location",
          description: "Please try again.",
        })
        return
      }

      toast.add({
        type: "success",
        title: "Location switched",
      })

      router.refresh()
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="h-auto w-full justify-start gap-2 px-2 py-2"
            disabled={isPending}
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <MapPin className="size-4" />
            </div>

            <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
              <span className="text-xs text-muted-foreground">
                Restaurant location
              </span>

              <span className="w-full truncate text-start text-sm font-semibold">
                {activeOrganization?.name ?? "Select location"}
              </span>
            </div>

            <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
          </Button>
        }
      />

      <DropdownMenuContent align="start" side="bottom" className="w-76">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Current location
          </DropdownMenuLabel>

          {activeOrganization && (
            <DropdownMenuItem className="gap-3" disabled>
              <Avatar className="size-8 rounded-md">
                <AvatarImage
                  src={activeOrganization.logo ?? undefined}
                  alt={activeOrganization.name}
                />
                <AvatarFallback className="rounded-md text-xs">
                  {activeOrganization.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <span className="min-w-0 flex-1 truncate font-medium">
                {activeOrganization.name}
              </span>

              <Check className="size-4 text-primary" />
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          {/* Other locations */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger disabled={isPending} className="gap-2">
              <MapPin className="size-4 text-muted-foreground" />
              Other locations
            </DropdownMenuSubTrigger>

            <DropdownMenuSubContent className="w-56">
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Your locations
              </DropdownMenuLabel>

              {otherLocations.map((organization) => (
                <DropdownMenuItem
                  key={organization.id}
                  disabled={isPending}
                  onClick={() => handleLocationChange(organization.id)}
                  className="gap-3"
                >
                  <Avatar className="size-8 rounded-md">
                    <AvatarImage
                      src={organization.logo ?? undefined}
                      alt={organization.name}
                    />
                    <AvatarFallback className="rounded-md text-xs">
                      {organization.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <span className="min-w-0 flex-1 truncate">
                    {organization.name}
                  </span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem
                onClick={() => setOpenAnotherLocationDialog(true)}
              >
                <Plus className="size-4 text-muted-foreground" />
                Create Another Location
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/manage-location")}
            >
              <Settings2 className="size-4 text-muted-foreground" />
              Manage location
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
      <AnotherLocationDialog
        open={openAnotherLocationDialog}
        setOpen={setOpenAnotherLocationDialog}
      />
    </DropdownMenu>
  )
}
