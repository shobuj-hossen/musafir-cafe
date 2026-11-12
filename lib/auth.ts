import { db } from "@/drizzle/db"
import * as schema from "@/drizzle/schema"
import { waitUntil } from "@vercel/functions"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { organization } from "better-auth/plugins"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      //   return await sendEmailResetPassword(user.email, url, user.name)
    },
    onPasswordReset: async ({ user }) => {
      console.log(`Password for user ${user.email} has been reset.`)
    },
  },
  session: { cookieCache: { enabled: true } },
  plugins: [
    organization({
      dynamicAccessControl: {
        enabled: true,
      },
    }),
    nextCookies(),
  ],
  advanced: {
    backgroundTasks: {
      handler: waitUntil,
    },
  },
})
