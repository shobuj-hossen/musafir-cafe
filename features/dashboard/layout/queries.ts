import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export async function getDashboardInitialData() {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({ headers: requestHeaders })
  if (!session) {
    redirect("/")
  }

  // Always safe: does not require an active organization.
  const organizations = await auth.api.listOrganizations({
    headers: requestHeaders,
  })

  if (organizations.length === 0) {
    redirect("/onboarding")
  }

  const activeOrganization = await auth.api.getFullOrganization({
    headers: requestHeaders,
  })
  const activeMember = await auth.api.getActiveMember({
    headers: requestHeaders,
  })

  return {
    session,
    organizations,
    activeOrganization,
    activeMember,
  }
}
