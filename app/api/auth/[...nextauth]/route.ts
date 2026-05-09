import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import User from "@/models/user";
import { connectToDB } from "@/utils/db";

const googleClientId = process.env.GOOGLE_ID;
const googleClientSecret = process.env.GOOGLE_SECRET;

if (!googleClientId || !googleClientSecret) {
  throw new Error("Missing GOOGLE_ID or GOOGLE_SECRET");
}

const handler = NextAuth({
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

        // Check if the user already exists in the database
        const email = profile?.email;
        if (!email) return false;

        const userExists = await User.findOne({ email });

        // If not, create a new user document
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
});

export { handler as GET, handler as POST };
