"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <section className="w-full flex-center flex-col gap-4 py-10">
        <div className="h-10 w-48 rounded-lg bg-black/10 animate-pulse" />
        <div className="h-24 w-24 rounded-full bg-black/10 animate-pulse" />
      </section>
    );
  }

  if (status === "unauthenticated" || !session?.user) {
    return (
      <section className="w-full flex-center flex-col gap-4 py-10">
        <p className="desc text-center">Sign in to view your profile.</p>
        <Link href="/" className="black_btn">
          Back home
        </Link>
      </section>
    );
  }

  const { name, email, image } = session.user;

  return (
    <section className="w-full flex-center flex-col gap-6 py-6">
      <h1 className="head_text text-center">
        <span className="orange_gradient">Profile</span>
      </h1>

      <Image
        src={image || "/assets/images/logo.svg"}
        alt="Profile"
        width={96}
        height={96}
        className="rounded-full border border-black/10"
      />

      <div className="flex flex-col items-center gap-1 text-center">
        {name ? (
          <p className="text-lg font-semibold text-gray-900">{name}</p>
        ) : null}
        {email ? <p className="desc">{email}</p> : null}
      </div>

      <Link href="/" className="outline_btn">
        Back home
      </Link>
    </section>
  );
}
