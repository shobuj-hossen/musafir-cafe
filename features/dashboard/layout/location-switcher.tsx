"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronsUpDown, Home, Loader2 } from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { toast } from "@/components/ui/toast"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenuButton } from "@/components/ui/sidebar"

import { DashboardSidebarData } from "./types"

interface LocationSwitcherProps {
  data: DashboardSidebarData
}

export function LocationSwitcher({ data }: LocationSwitcherProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const { organizations, activeOrganization, activeOrganizationId } = data

  function handleSwitch(organizationId: string) {
    if (isPending || organizationId === activeOrganizationId) return

    startTransition(async () => {
      const { error } = await authClient.organization.setActive({
        organizationId,
      })

      if (error) {
        toast.add({ title: error.message || "Failed to switch location" })
        return
      }

      router.refresh()
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <SidebarMenuButton
            size="lg"
            disabled={isPending}
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Home className="size-4" />
            </div>

            <div className="flex min-w-0 flex-col gap-0.5 leading-none">
              <span className="font-medium">Location</span>
              <span className="truncate text-xs text-muted-foreground">
                {activeOrganization?.name ?? "Select location"}
              </span>
            </div>

            {isPending ? (
              <Loader2 className="ml-auto size-4 animate-spin" />
            ) : (
              <ChevronsUpDown className="ml-auto size-4" />
            )}
          </SidebarMenuButton>
        }
      />

      <DropdownMenuContent align="start">
        {organizations.map((organization) => {
          const isSelected = organization.id === activeOrganizationId

          return (
            <DropdownMenuItem
              key={organization.id}
              disabled={isPending || isSelected}
              onClick={() => handleSwitch(organization.id)}
            >
              <span className="truncate">{organization.name}</span>

              {isSelected && <Check className="ml-auto size-4" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
