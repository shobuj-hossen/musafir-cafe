"use client"
import logo from "@/public/dashboard-logo.png"
import Image from "next/image"

export function DashboardLogo() {
  return (
    <div>
      <Image
        loading="eager"
        style={{ width: "100%", height: "auto" }}
        src={logo}
        alt="Logo"
        className="bg-white/90 drop-shadow-xs drop-shadow-primary/20"
      />
    </div>
  )
}
