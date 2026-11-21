"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"

type Organization = {
  id: string
  name: string
  slug: string
}

type Props = {
  initialUser: {
    id: string
    name: string
    email: string
  } | null
  initialOrganizations: Organization[]
  initialActiveOrganization: Organization | null
  initialActiveMember: {
    id: string
    role: string
  } | null
}

export function OrganizationPlayground({
  initialUser,
  initialOrganizations,
  initialActiveOrganization,
  initialActiveMember,
}: Props) {
  const router = useRouter()

  // Reactive Better Auth data
  const { data: session, isPending: sessionPending } = authClient.useSession()

  const { data: organizations, isPending: organizationsPending } =
    authClient.useListOrganizations()

  const { data: activeOrganization, isPending: activeOrganizationPending } =
    authClient.useActiveOrganization()

  // UI state
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  // Use initial server data until client hooks load
  const user = session?.user ?? initialUser
  const orgs = organizations ?? initialOrganizations
  const activeOrg =
    activeOrganization ??
    (activeOrganizationPending ? initialActiveOrganization : null)

  async function createOrganization() {
    if (!name.trim() || !slug.trim()) {
      setMessage("Organization name and slug are required.")
      return
    }

    setLoading(true)
    setMessage("")

    try {
      // 1. Create organization
      const { data, error } = await authClient.organization.create({
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        keepCurrentActiveOrganization: false,
      })

      if (error) {
        throw new Error(error.message)
      }

      if (!data) {
        throw new Error("Organization creation failed.")
      }

      // 2. Explicitly activate the newly created organization
      const { error: switchError } = await authClient.organization.setActive({
        organizationId: data.id,
      })

      if (switchError) {
        throw new Error(
          `Created successfully, but activation failed: ${switchError.message}`
        )
      }

      // 3. Reset form
      setName("")
      setSlug("")

      // 4. Show success
      setMessage(`${data.name} created and activated successfully!`)

      // 5. Refresh server components
      router.refresh()
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong."
      )
    } finally {
      setLoading(false)
    }
  }

  async function switchOrganization(organizationId: string) {
    setLoading(true)
    setMessage("")

    try {
      const { error } = await authClient.organization.setActive({
        organizationId,
      })

      if (error) {
        throw new Error(error.message)
      }

      setMessage("Active organization switched successfully.")

      // Refresh server components to get the new active org
      router.refresh()
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to switch organization."
      )
    } finally {
      setLoading(false)
    }
  }

  async function clearActiveOrganization() {
    setLoading(true)

    try {
      const { error } = await authClient.organization.setActive({
        organizationId: null,
      })

      if (error) {
        throw new Error(error.message)
      }

      setMessage("Active organization cleared.")
      router.refresh()
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to clear active organization."
      )
    } finally {
      setLoading(false)
    }
  }

  async function logout() {
    setLoading(true)

    try {
      await authClient.signOut()
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Organization Playground</h1>
        <p className="text-sm text-muted-foreground">
          Better Auth organization testing environment
        </p>
      </div>

      {/* SESSION */}
      <section className="space-y-3 rounded-xl border p-5">
        <h2 className="font-semibold">1. Authentication</h2>

        {sessionPending ? (
          <p>Checking session...</p>
        ) : user ? (
          <>
            <p className="font-medium text-green-600">Authenticated</p>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p className="text-xs break-all">User ID: {user.id}</p>

            <button
              onClick={logout}
              disabled={loading}
              className="rounded-md bg-destructive px-4 py-2 text-sm text-white"
            >
              Logout
            </button>
          </>
        ) : (
          <p className="text-red-500">Not authenticated. Please sign in.</p>
        )}
      </section>

      {user && (
        <>
          {/* ORGANIZATIONS */}
          <section className="space-y-3 rounded-xl border p-5">
            <h2 className="font-semibold">2. My Organizations</h2>

            <p>
              Total organizations:{" "}
              {organizationsPending ? "Loading..." : orgs.length}
            </p>

            {orgs.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                You don't belong to any organization yet. Create one below.
              </p>
            ) : (
              <div className="space-y-2">
                {orgs.map((org) => (
                  <div
                    key={org.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"
                  >
                    <div>
                      <p className="font-medium">{org.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {org.slug} · {org.id}
                      </p>
                    </div>

                    {activeOrg?.id === org.id ? (
                      <span className="text-sm text-green-600">Active</span>
                    ) : (
                      <button
                        onClick={() => switchOrganization(org.id)}
                        disabled={loading}
                        className="rounded-md border px-3 py-1.5 text-sm"
                      >
                        Switch
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* CREATE ORGANIZATION */}
          <section className="space-y-3 rounded-xl border p-5">
            <h2 className="font-semibold">3. Create Organization</h2>

            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setSlug(
                  e.target.value
                    .toLowerCase()
                    .trim()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-|-$/g, "")
                )
              }}
              placeholder="Organization name"
              className="w-full rounded-md border bg-transparent p-2"
            />

            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="Organization slug"
              className="w-full rounded-md border bg-transparent p-2"
            />

            <button
              onClick={createOrganization}
              disabled={loading || !name.trim() || !slug.trim()}
              className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
            >
              {loading ? "Processing..." : "Create Organization"}
            </button>

            <p className="text-xs text-muted-foreground">
              keepCurrentActiveOrganization is false. Creating a new
              organization can therefore make it the active organization.
            </p>
          </section>

          {/* ACTIVE ORGANIZATION */}
          <section className="space-y-3 rounded-xl border p-5">
            <h2 className="font-semibold">4. Active Organization</h2>

            {activeOrganizationPending ? (
              <p>Checking active organization...</p>
            ) : activeOrg ? (
              <>
                <p className="font-medium text-green-600">
                  An organization is active
                </p>
                <p>Name: {activeOrg.name}</p>
                <p>Slug: {activeOrg.slug}</p>
                <p className="text-xs break-all">ID: {activeOrg.id}</p>

                <button
                  onClick={clearActiveOrganization}
                  disabled={loading}
                  className="rounded-md border px-3 py-2 text-sm"
                >
                  Clear Active Organization
                </button>
              </>
            ) : (
              <p className="text-amber-600">No active organization selected.</p>
            )}
          </section>

          {/* SERVER SNAPSHOT */}
          <section className="space-y-3 rounded-xl border p-5">
            <h2 className="font-semibold">5. Server-side Snapshot</h2>

            <p>
              Initial server organization:{" "}
              {initialActiveOrganization?.name ?? "None"}
            </p>

            <p>
              Initial server membership role:{" "}
              {initialActiveMember?.role ?? "None"}
            </p>

            <button
              onClick={() => router.refresh()}
              className="rounded-md border px-3 py-2 text-sm"
            >
              Refresh Server Data
            </button>
          </section>
        </>
      )}

      {message && (
        <div className="rounded-lg border p-3 text-sm">{message}</div>
      )}
    </main>
  )
}
