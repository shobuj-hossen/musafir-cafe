"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Loader2, LogOut } from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { toast } from "../ui/toast"

export function LogoutMenuItem() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <DropdownMenuItem
      variant="destructive"
      disabled={isPending}
      closeOnClick={false}
      onClick={() => {
        startTransition(async () => {
          try {
            const { error } = await authClient.signOut()

            if (error) {
              throw new Error(error.message || "Failed to log out")
            }

            router.replace("/login")
            router.refresh()
          } catch (err) {
            toast.add({
              type: "error",
              title: "Sign out failed",
              description: "Something went wrong. Please try again.",
            })
          }
        })
      }}
    >
      {isPending ? (
        <Loader2 className="mr-2 size-4 animate-spin" />
      ) : (
        <LogOut className="mr-2 size-4" />
      )}
      <span>{isPending ? "Signing out..." : "Log out"}</span>
    </DropdownMenuItem>
  )
}
