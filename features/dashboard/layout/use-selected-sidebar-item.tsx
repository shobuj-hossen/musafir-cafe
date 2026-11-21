"use client"
import { usePathname } from "next/navigation"

import { sidebarData } from "./dashboard-sidebar"

export function useSelectedSidebaritem() {
  const pathname = usePathname().split("?")[0]
  const selectedSidebarItem = sidebarData.navMain
    .find((navMenu) => navMenu.items.some((item) => item.url === pathname))
    ?.items.find((item) => item.url === pathname)?.title
  return selectedSidebarItem
}
