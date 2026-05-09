import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import User from "@/models/user";
import { connectToDB } from "@/utils/db";

const googleClientId = process.env.GOOGLE_ID;
const googleClientSecret = process.env.GOOGLE_SECRET;

const authOptions: NextAuthOptions = {
  // Don’t throw at module evaluation time. If env vars aren’t set, we register
  // no providers so builds/dev don’t crash; auth just won’t be available.
  providers:
    googleClientId && googleClientSecret
      ? [
          GoogleProvider({
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          }),
        ]
      : [],

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
          const username = profile?.name?.replaceAll(" ", "").toLowerCase() ?? email;
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

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
