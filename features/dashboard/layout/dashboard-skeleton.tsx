import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { headers } from "next/headers"
import { DashboardHeaderSkeleton } from "./dashboard-header-skeleton"
import { AppSidebarSkeleton } from "./dashboard-sidebar-skeleton"

export default function DashboardSkeleton(props: LayoutProps<"/">) {
  headers
  return (
    <SidebarProvider>
      <AppSidebarSkeleton />
      <SidebarInset>
        <DashboardHeaderSkeleton />
        <div className="p-4">{props.children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
