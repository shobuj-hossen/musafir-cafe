import { getDashboardSidebarData } from "./queries"

export type DashboardSidebarData = Awaited<
  ReturnType<typeof getDashboardSidebarData>
>
