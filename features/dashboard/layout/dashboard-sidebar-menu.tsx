"use client"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { sidebarData } from "./dashboard-sidebar"
import { useSelectedSidebaritem } from "./use-selected-sidebar-item"

export function DashboardSidebarMenu() {
  const selectedSidebarItem = useSelectedSidebaritem()

  return (
    <>
      {sidebarData.navMain
        .filter((group) => !group.hidden)
        .map((group) => {
          const GroupIcon = group.icon

          return (
            <SidebarGroup key={group.title}>
              <SidebarGroupLabel className="gap-2">
                {GroupIcon && <GroupIcon className="size-4" />}
                <span>{group.title}</span>
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items
                    ?.filter((subItem) => !subItem.hidden)
                    .map((subItem) => {
                      const SubItemIcon = subItem.icon

                      return (
                        <SidebarMenuItem key={subItem.title}>
                          <SidebarMenuButton
                            data-selected={
                              subItem.title === selectedSidebarItem
                            }
                            isActive={subItem.title === selectedSidebarItem}
                            className="data-[selected=false]:hover:bg-transparent"
                            render={
                              <Link href={subItem.url}>
                                {SubItemIcon && <SubItemIcon />}
                                <span>{subItem.title}</span>
                              </Link>
                            }
                          />
                        </SidebarMenuItem>
                      )
                    })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )
        })}
    </>
  )
}
