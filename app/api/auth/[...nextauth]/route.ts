import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import User from "@/models/user";
import { connectToDB } from "@/utils/db";

function getAuthOptions(): NextAuthOptions {
  const googleClientId = process.env.GOOGLE_ID;
  const googleClientSecret = process.env.GOOGLE_SECRET;

  if (!googleClientId || !googleClientSecret) {
    throw new Error("Missing GOOGLE_ID or GOOGLE_SECRET");
  }

  return {
    providers: [
      GoogleProvider({
        clientId: googleClientId,
        clientSecret: googleClientSecret,
      }),
    ],

    callbacks: {
      async session({ session }) {
        const email = session.user?.email;
        if (email) {
          const sessionUser = await User.findOne({ email });
          if (sessionUser) {
            session.user.id = sessionUser._id.toString();
          }
        }

        return session;
      },

      async signIn({ profile }) {
        try {
          await connectToDB();

          const email = profile?.email;
          if (!email) return false;

          const userExists = await User.findOne({ email });

          if (!userExists) {
            const username =
              profile?.name?.replaceAll(" ", "").toLowerCase() ?? email;
            const image = (profile as { picture?: string } | undefined)?.picture;

            await User.create({
              email,
              username,
              image,
            });
          }

          return true;
        } catch (error) {
          console.error("Error during sign-in:", error);
          return false;
        }
      },
    },
  };
}

export async function GET(req: Request) {
  const handler = NextAuth(getAuthOptions() satisfies NextAuthOptions);
  return handler(req);
}

export async function POST(req: Request) {
  const handler = NextAuth(getAuthOptions() satisfies NextAuthOptions);
  return handler(req);
}
