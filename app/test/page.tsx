import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { OrganizationPlayground } from "./organization-playground"

import { Suspense } from "react"

export default async function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TestPage />
    </Suspense>
  )
}

async function TestPage() {
  const requestHeaders = await headers()

  const session = await auth.api.getSession({
    headers: requestHeaders,
  })

  if (!session) {
    return (
      <OrganizationPlayground
        initialUser={null}
        initialOrganizations={[]}
        initialActiveOrganization={null}
        initialActiveMember={null}
      />
    )
  }

  // Always safe: does not require an active organization.
  const organizations = await auth.api.listOrganizations({
    headers: requestHeaders,
  })

  // Read the active organization ID directly from the session.
  const activeOrganizationId = session.session.activeOrganizationId

  let activeOrganization = null
  let activeMember = null

  // Only request active organization data when an ID exists.
  if (activeOrganizationId) {
    const [organizationResult, memberResult] = await Promise.allSettled([
      auth.api.getFullOrganization({
        headers: requestHeaders,
      }),
      auth.api.getActiveMember({
        headers: requestHeaders,
      }),
    ])

    if (organizationResult.status === "fulfilled") {
      activeOrganization = organizationResult.value
    }

    if (memberResult.status === "fulfilled") {
      activeMember = memberResult.value
    }
  }

  return (
    <OrganizationPlayground
      initialUser={{
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
      }}
      initialOrganizations={organizations}
      initialActiveOrganization={activeOrganization}
      initialActiveMember={activeMember}
    />
  )
}
