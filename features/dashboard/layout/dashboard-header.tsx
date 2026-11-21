import HeaderPageTitle from "./header-page-title"
import { NavUser } from "./nav-user"
import { DashboardInitialData } from "./types"

export function DashboardHeader({ data }: { data: DashboardInitialData }) {
  return (
    <header className="flex h-18 items-center justify-between p-2">
      <HeaderPageTitle />
      <div className="self-end">
        <NavUser data={data} />
      </div>
    </header>
  )
}
