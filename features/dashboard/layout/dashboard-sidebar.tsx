import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { DashboardLogo } from "./dashboard-logo"
import RestaurantLocations from "./restaurant-locations"
import { DashboardInitialData } from "./types"

import { LayoutDashboard, MapPin, ShoppingCart } from "lucide-react"

import { LucideIcon } from "lucide-react"
import { DashboardSidebarMenu } from "./dashboard-sidebar-menu"

export interface NavItem {
  title: string
  url: string
  icon?: LucideIcon
  hidden?: boolean
  isActive?: boolean
  items?: NavItem[]
}

export interface SidebarData {
  navMain: NavItem[]
}

export const sidebarData: SidebarData = {
  navMain: [
    {
      title: "Getting Started",
      url: "#",

      hidden: false,
      items: [
        {
          title: "Overviews",
          url: "/dashboard/overviews",
          icon: LayoutDashboard,
          hidden: false,
        },
        {
          title: "Orders",
          url: "/dashboard/orders",
          icon: ShoppingCart,
          hidden: false,
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      hidden: false,
      items: [
        {
          title: "Manage Location",
          url: "/dashboard/manage-location",
          icon: MapPin,
          hidden: true,
        },
      ],
    },
  ],
}

export function DashboardSidebar({
  data,
  ...props
}: React.ComponentProps<typeof Sidebar> & { data: DashboardInitialData }) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <DashboardLogo />
        <RestaurantLocations data={data} />
      </SidebarHeader>
      <SidebarContent>
        <DashboardSidebarMenu />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
