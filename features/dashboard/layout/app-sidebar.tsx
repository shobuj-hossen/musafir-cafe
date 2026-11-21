import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { AppSidebarMenu } from "./app-sidebar-menu"
import { DashboardLogo } from "./dashboard-logo"
import { DashboardSidebarData } from "./types"
import { NavUser } from "./nav-user"
import RestaurantLocations from "./restaurant-locations"

// This is sample data.
export const sidebarData = {
  navMain: [
    {
      title: "Getting Started",
      url: "#",
      items: [
        {
          title: "Overviews",
          url: "/dashboard/overviews",
        },
        {
          title: "Orders",
          url: "/dashboard/orders",
        },
      ],
    },
  ],
}

export function AppSidebar({
  data,
  ...props
}: React.ComponentProps<typeof Sidebar> & { data: DashboardSidebarData }) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <DashboardLogo />

        <RestaurantLocations data={data} />
      </SidebarHeader>
      <SidebarContent>
        <AppSidebarMenu />
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter>
        <NavUser session={data.session} />
      </SidebarFooter>
    </Sidebar>
  )
}
