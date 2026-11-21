import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { OnboardingForm } from "../components/onboarding-form"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function OnboardingPage() {
  return (
    <Suspense fallback={<OnboardingSkeleton />}>
      <Onboarding />
    </Suspense>
  )
}

async function Onboarding() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    redirect("/signin")
  }
  return <OnboardingForm />
}

function OnboardingSkeleton() {
  return (
    <div className="mx-auto w-full max-w-md space-y-6 rounded-xl border p-6 shadow-sm">
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>

      <Skeleton className="h-10 w-full" />
    </div>
  )
}
