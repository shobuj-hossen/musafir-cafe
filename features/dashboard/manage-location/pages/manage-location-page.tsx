import { redirect } from "next/navigation"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { LocationSettings } from "../components/location-settings"
import { getDashboardInitialData } from "../../layout/queries"

export default function ManageLocationPage() {
  return (
    <Suspense fallback={<ManageLocationSkeleton />}>
      <ManageLocation />
    </Suspense>
  )
}

async function ManageLocation() {
  const data = await getDashboardInitialData()

  if (!data.activeOrganization) {
    redirect("/onboarding")
  }

  return (
    <LocationSettings
      location={{
        id: data.activeOrganization.id,
        name: data.activeOrganization.name,
      }}
      locations={data.organizations.map((org) => ({
        id: org.id,
        name: org.name,
      }))}
    />
  )
}

function ManageLocationSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-52" />
        <Skeleton className="h-4 w-80" />
      </div>

      <div className="space-y-6 rounded-xl border p-6 shadow-sm">
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="flex justify-end">
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      <div className="space-y-4 rounded-xl border p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-56" />
          </div>
          <Skeleton className="h-9 w-28" />
        </div>

        <div className="space-y-3 pt-2">
          <Skeleton className="h-14 w-full rounded-lg" />
          <Skeleton className="h-14 w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}
