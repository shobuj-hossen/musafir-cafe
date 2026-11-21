import { getDashboardInitialData } from "./queries"

export type DashboardInitialData = Awaited<
  ReturnType<typeof getDashboardInitialData>
>
