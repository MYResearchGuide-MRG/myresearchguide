"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { logout } from "@/app/dashboard/actions";

type ShellProfile = {
  name: string | null;
  username: string | null;
  role: string | null;
};

const pillBase =
  "!rounded-full !px-3.5 !py-1.5 !text-sm !no-underline !transition-colors";
const activePill = `${pillBase} !text-white !bg-zinc-800/70`;
const inactivePill = `${pillBase} !text-zinc-400 hover:!text-white`;

export default function DashboardShell({
  profile,
  children,
}: {
  profile: ShellProfile;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const section =
    pathname === "/dashboard"
      ? "Profile"
      : pathname.startsWith("/dashboard/articles")
        ? "Articles"
        : pathname.startsWith("/dashboard/admin")
          ? "Admin"
          : "";

  // "/dashboard" needs an exact match (its prefix also matches every other
  // route); the rest are prefix matches so sub-pages keep their pill lit.
  const navLinks = [
    { href: "/dashboard", label: "Profile", active: pathname === "/dashboard" },
    {
      href: "/dashboard/articles",
      label: "Articles",
      active: pathname.startsWith("/dashboard/articles"),
    },
    ...(profile.role === "admin"
      ? [
          {
            href: "/dashboard/admin",
            label: "Admin",
            active: pathname.startsWith("/dashboard/admin"),
          },
        ]
      : []),
  ];

  const initial = (profile.name ?? "").trim().charAt(0).toUpperCase() || "?";

  return (
    <main className="!relative !min-h-screen !bg-black !overflow-x-hidden !text-white">
      <header className="!sticky !top-0 !z-40 !border-b !border-zinc-800/80 !bg-black/80 !backdrop-blur">
        <div className="!max-w-5xl !mx-auto !flex !items-center !justify-between !gap-4 !px-4 md:!px-8 !py-4 !relative">
          <Link
            href="/dashboard"
            className="!text-lg !font-bold !tracking-tighter !text-white !no-underline"
          >
            MRG
            {section ? (
              <span className="!text-zinc-500 !text-sm"> {section}</span>
            ) : null}
          </Link>

          {/* Centered nav cluster — identical pill padding, even gaps. The
              active pill is a motion.span with a shared layoutId, so the
              highlight slides between links. */}
          <nav className="!hidden md:!flex !absolute !left-1/2 !-translate-x-1/2 !items-center !gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${pillBase} !relative ${
                  link.active
                    ? "!text-white"
                    : "!text-zinc-400 hover:!text-white"
                }`}
              >
                {link.active ? (
                  <motion.span
                    layoutId="nav-pill"
                    className="!absolute !inset-0 !rounded-full !bg-zinc-800/70"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                ) : null}
                <span className="!relative">{link.label}</span>
              </Link>
            ))}
          </nav>

          <div className="!flex !items-center !gap-4">
            <Link
              href="/"
              className={`${inactivePill} !hidden md:!inline-block`}
            >
              View site
            </Link>
            <div className="!flex !items-center !gap-2">
              <span className="!h-7 !w-7 !rounded-full !bg-zinc-800 !text-[11px] !flex !items-center !justify-center">
                {initial}
              </span>
              <button
                type="button"
                onClick={async () => {
                  await logout();
                }}
                className="!text-sm !text-zinc-400 hover:!text-white !transition-colors !cursor-pointer"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>

        <div className="md:!hidden !flex !items-center !gap-1 !overflow-x-auto !px-4 !py-2 !border-t !border-zinc-800/60 !no-scrollbar">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={link.active ? activePill : inactivePill}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/" className={inactivePill}>
            View site
          </Link>
        </div>
      </header>

      {children}
    </main>
  );
}
