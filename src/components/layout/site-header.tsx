"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/layout/auth-provider";

export function SiteHeader() {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();

  // The editor is a full-viewport studio with its own chrome.
  if (pathname === "/create") return null;

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { href: "/templates", label: "Templates" },
    { href: "/about", label: "About" },
    ...(isAuthenticated ? [{ href: "/my-labels", label: "My Documents" }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 grid h-[68px] w-full grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-ink bg-cream/95 px-4 backdrop-blur-sm sm:px-9 md:grid-cols-[280px_1fr_auto]">
      <Link
        href="/"
        className="grid grid-cols-[38px_auto] grid-rows-2 items-center"
        aria-label="Mail Buddy Home"
      >
        <span className="row-span-2 grid h-[31px] w-[31px] -rotate-6 place-items-center rounded-full border border-ink bg-pink">
          <Image
            src="/press-notes/loop-mark.svg"
            alt=""
            width={18}
            height={18}
            className="h-[18px] w-[18px]"
          />
        </span>
        <b className="whitespace-nowrap font-display text-[15px] leading-none tracking-[-0.02em] text-ink">
          MAIL BUDDY
        </b>
        <small className="pn-annotation whitespace-nowrap text-[7px] text-muted-ink">
          Press Notes / Field study
        </small>
      </Link>

      <nav
        className="hidden justify-self-center md:flex md:gap-7"
        aria-label="Main navigation"
      >
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`pn-kicker py-2 transition-colors duration-[160ms] ${
              isActive(item.href)
                ? "text-ink underline decoration-2 underline-offset-4"
                : "text-muted-ink hover:text-ink"
            }`}
            aria-current={isActive(item.href) ? "page" : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        {isAuthenticated ? (
          <button
            onClick={() => logout()}
            className="pn-kicker hidden cursor-pointer border border-transparent px-3 py-2 text-muted-ink transition-colors duration-[160ms] hover:text-ink sm:block"
            aria-label="Log out"
          >
            Log out
          </button>
        ) : (
          <Link
            href="/login"
            className="pn-kicker hidden border border-transparent px-3 py-2 text-muted-ink transition-colors duration-[160ms] hover:text-ink sm:block"
          >
            Log in
          </Link>
        )}
        <Link
          href="/create"
          className="pn-kicker flex h-[34px] items-center justify-between gap-4 border border-ink bg-ink px-3 text-white-ink transition-transform duration-[160ms] hover:-translate-y-px"
        >
          Open the editor <span aria-hidden="true">-&gt;</span>
        </Link>
      </div>
    </header>
  );
}
