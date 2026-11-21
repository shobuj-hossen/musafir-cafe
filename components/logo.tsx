"use client"
import logo from "@/public/logo.png"
import Image from "next/image"

export default function Logo() {
  return (
    <div>
      <Image
        loading="eager"
        style={{ width: "200px", height: "auto" }}
        src={logo}
        alt="Logo"
      />
    </div>
  )
}
