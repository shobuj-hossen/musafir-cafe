import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"

const AUTH_ROUTES = [
  "/signin",
  "/signup",
  "/forgot-password",
  "/reset-password",
]
const PUBLIC_ROUTES = ["/"]

export default async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  const { pathname } = request.nextUrl

  const isAuthRoute = AUTH_ROUTES.includes(pathname)
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname)

  if (!session && !isPublicRoute && !isAuthRoute) {
    return NextResponse.redirect(new URL("/signin", request.url))
  }
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard/overviews", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
}
