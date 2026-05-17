"use client";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

type ProviderProps = {
  children: ReactNode;
  session?: Session | null;
};

const Provider = ({ children, session }: ProviderProps) => {
  // NextAuth treats any defined `session` (including `null`) as the initial value and
  // skips the client getSession() fetch. Use `undefined` so the client loads the session.
  return (
    <SessionProvider session={session ?? undefined}>{children}</SessionProvider>
  );
};

export default Provider;
