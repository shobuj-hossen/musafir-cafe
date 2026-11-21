import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export async function getDashboardSidebarData() {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({ headers: requestHeaders })
  if (!session) {
    redirect("/")
  }

  // Always safe: does not require an active organization.
  const organizations = await auth.api.listOrganizations({
    headers: requestHeaders,
  })

  // Read the active organization ID directly from the session.
  const activeOrganizationId = session.session.activeOrganizationId

  let activeOrganization: Awaited<
    ReturnType<typeof auth.api.getFullOrganization>
  > = null
  let activeMember: Awaited<
    ReturnType<typeof auth.api.getActiveMember>
  > | null = null

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

  return {
    session,
    organizations,
    activeOrganizationId,
    activeOrganization,
    activeMember,
  }
}
