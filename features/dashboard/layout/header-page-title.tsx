"use client"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useSelectedSidebaritem } from "./use-selected-sidebar-item"

export default function HeaderPageTitle() {
  const selectedSidebarItem = useSelectedSidebaritem()
  return (
    <div className="flex shrink-0 items-center gap-2">
      <SidebarTrigger className="-ml-1" />
      <h1 className="text-xl font-semibold">{selectedSidebarItem}</h1>
    </div>
  )
}
