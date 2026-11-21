import { db } from "@/drizzle/db"
import * as schema from "@/drizzle/schema"
import { waitUntil } from "@vercel/functions"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { organization } from "better-auth/plugins"
import { generateAvatarUrl } from "./generate-avatar"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
  },
  emailVerification: {
    sendVerificationEmail: async ({ token, url, user }) => {
      console.log("s=>", url)
    },
    sendOnSignUp: true,
    sendOnSignIn: false,
    autoSignInAfterVerification: true,
  },
  session: { cookieCache: { enabled: true } },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          return {
            data: {
              ...user,
              image: generateAvatarUrl(user.email, "adventurer-neutral"),
            },
          }
        },
      },
    },

    session: {
      create: {
        before: async (session) => {
          const firstMembership = await db.query.members.findFirst({
            where: { userId: session.userId },
            orderBy: { createdAt: "asc" },
          })

          return {
            data: {
              ...session,
              activeOrganizationId: firstMembership?.organizationId ?? null,
            },
          }
        },
      },
    },
  },

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
