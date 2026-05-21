"use client";
import Image from "next/image";
import Link from "next/link";
import type { BuiltInProviderType } from "next-auth/providers/index";
import type { ClientSafeProvider, LiteralUnion } from "next-auth/react";
import { getProviders, signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type ProvidersType = Record<
  LiteralUnion<BuiltInProviderType>,
  ClientSafeProvider
> | null;

const NavAuthSkeleton = () => (
  <div className="flex items-center gap-3 md:gap-5" aria-hidden="true">
    <div className="hidden sm:block h-9 w-28 rounded-full bg-black/10 animate-pulse" />
    <div className="hidden sm:block h-9 w-24 rounded-full bg-black/10 animate-pulse" />
    <div className="h-[37px] w-[37px] rounded-full bg-black/10 animate-pulse shrink-0" />
  </div>
);

const Nav = () => {
  const { data: session, status } = useSession();

  const [providers, setProviders] = useState<ProvidersType>(null);
  const [toggleDropdown, setToggleDropdown] = useState(false);

  const isAuthed = status === "authenticated" && Boolean(session?.user);
  const showAuthSkeleton =
    status === "loading" ||
    (status === "unauthenticated" && providers === null);
  const providerList = providers ? Object.values(providers) : [];
  const showProviderSignIn =
    status === "unauthenticated" && providerList.length > 0;

  useEffect(() => {
    const fetchProviders = async () => {
      const response = await getProviders();

      setProviders(response);
    };

    fetchProviders();
  }, []);

  return (
    <nav className="flex-between w-full mb-16 pt-3">
      <Link href="/" className="flex gap-2 flex-center">
        <img
          src="/assets/images/promptforge-logo.svg"
          alt="PromptForge Logo"
          width={55}
          height={55}
          className="logo_text"
        />
      </Link>

      {/* Desktop Navigation */}
      <div className="sm:flex hidden">
        {isAuthed && session?.user ? (
          <div className="flex gap-3 md:gap-5">
            <Link href="/create-prompt" className="black_btn">
              Create Post
            </Link>

            <button
              type="button"
              onClick={() => signOut()}
              className="outline_btn cursor-pointer"
            >
              Sign Out
            </button>

            <Link href="/profile">
              <Image
                src={session.user.image || "/assets/images/promptforge-logo"}
                alt="Profile"
                width={37}
                height={37}
                className="rounded-full"
              />
            </Link>
          </div>
        ) : showAuthSkeleton ? (
          <NavAuthSkeleton />
        ) : showProviderSignIn ? (
          providerList.map((provider) => (
            <button
              type="button"
              key={provider.name}
              onClick={() => signIn(provider.id)}
              className="black_btn cursor-pointer"
            >
              Sign In
            </button>
          ))
        ) : (
          <button
            type="button"
            onClick={() => signIn("google")}
            className="black_btn"
          >
            Sign In
          </button>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className="sm:hidden flex relative">
        {isAuthed && session?.user ? (
          <div className="flex">
            <Image
              src={session.user.image || "/assets/images/promptforge-logo"}
              alt="Profile"
              width={37}
              height={37}
              className="rounded-full"
              onClick={() => setToggleDropdown((prev) => !prev)}
            />

            {toggleDropdown && (
              <div className="dropdown">
                <Link
                  href="/profile"
                  className="dropdown_link"
                  onClick={() => setToggleDropdown(false)}
                >
                  My Profile{" "}
                </Link>

                <Link
                  href="/create-prompt"
                  className="dropdown_link"
                  onClick={() => setToggleDropdown(false)}
                >
                  Create Prompt{" "}
                </Link>

                <button
                  type="button"
                  className="mt-5 w-full black_btn"
                  onClick={() => {
                    signOut();
                    setToggleDropdown(false);
                  }}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : showAuthSkeleton ? (
          <NavAuthSkeleton />
        ) : showProviderSignIn ? (
          providerList.map((provider) => (
            <button
              type="button"
              key={provider.name}
              onClick={() => signIn(provider.id)}
              className="black_btn"
            >
              Sign In
            </button>
          ))
        ) : (
          <button
            type="button"
            onClick={() => signIn("google")}
            className="black_btn"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};

export default Nav;
