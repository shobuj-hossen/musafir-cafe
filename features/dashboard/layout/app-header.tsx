import AppHeaderPageTitle from "./app-header-page-title"
import { NavUser } from "./nav-user"

export default function AppHeader() {
  return (
    <header className="flex h-18 items-center justify-between p-2">
      <AppHeaderPageTitle />
    </header>
  )
}
