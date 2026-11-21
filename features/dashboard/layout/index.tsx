import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { headers } from "next/headers"
import { Suspense } from "react"
import AppHeader from "./app-header"
import { AppSidebar } from "./app-sidebar"
import { AppSidebarSkeleton } from "./app-sidebar-skeleton"
import { getDashboardSidebarData } from "./queries"

export default function DashboardLayout(props: LayoutProps<"/">) {
  headers
  return (
    <SidebarProvider>
      <Suspense fallback={<AppSidebarSkeleton />}>
        <AppSidebarData />
      </Suspense>

      <SidebarInset>
        <AppHeader />
        <div className="p-4">{props.children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}

async function AppSidebarData() {
  const data = await getDashboardSidebarData()
  return <AppSidebar data={data} />
}
