import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { headers } from "next/headers"
import { Suspense } from "react"
import { DashboardSidebar } from "./dashboard-sidebar"
import DashboardSkeleton from "./dashboard-skeleton"
import { getDashboardInitialData } from "./queries"
import { DashboardHeader } from "./dashboard-header"

export default function DashboardLayout(props: LayoutProps<"/">) {
  headers
  return (
    <Suspense fallback={<DashboardSkeleton {...props} />}>
      <Dashboard {...props} />
    </Suspense>
  )
}

async function Dashboard(props: LayoutProps<"/">) {
  const data = await getDashboardInitialData()
  return (
    <SidebarProvider>
      <DashboardSidebar data={data} />

      <SidebarInset>
        <DashboardHeader data={data} />
        <div className="p-4">{props.children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
