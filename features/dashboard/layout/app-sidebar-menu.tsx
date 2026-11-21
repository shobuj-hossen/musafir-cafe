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
import { sidebarData } from "./app-sidebar"
import { useSelectedSidebaritem } from "./use-selected-sidebar-item"

export function AppSidebarMenu() {
  const selectedSidebarItem = useSelectedSidebaritem()
  return (
    <>
      {sidebarData.navMain.map((item) => (
        <SidebarGroup key={item.title}>
          <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {item.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    data-selected={item.title === selectedSidebarItem}
                    isActive={item.title === selectedSidebarItem}
                    className="data-[selected=false]:hover:bg-transparent"
                    render={<Link href={item.url}>{item.title}</Link>}
                  ></SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  )
}
