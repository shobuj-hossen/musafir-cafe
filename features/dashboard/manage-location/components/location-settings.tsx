"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast"
import { authClient } from "@/lib/auth-client"
import { Loader2, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { OrganizationNameForm } from "./org-name-form"
import { DeleteLocationSection } from "./delete-location"

// -----------------------------------------------------------------------------
// Types & validation
// -----------------------------------------------------------------------------

export type Location = {
  id: string
  name: string
}

export type LocationSettingsProps = {
  location: Location
  locations: Location[]
}

// -----------------------------------------------------------------------------
// Main page
// -----------------------------------------------------------------------------

export function LocationSettings({
  location,
  locations,
}: LocationSettingsProps) {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Location Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your restaurant location settings.
        </p>
      </div>

      <OrganizationNameForm location={location} />

      <DeleteLocationSection location={location} locations={locations} />
    </div>
  )
}
