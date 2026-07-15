"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/layout/auth-provider";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function SiteHeader() {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { href: "/create", label: "Merge", index: "01" },
    { href: "/templates", label: "Templates", index: "02" },
  ];

  if (isAuthenticated) {
    navItems.push({ href: "/my-labels", label: "My Documents", index: "03" });
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-ink bg-sage">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-transform duration-[160ms] hover:-translate-y-px"
          aria-label="Mail Buddy Home"
        >
          <Image
            src="/press-notes/loop-mark.svg"
            alt=""
            width={24}
            height={24}
            className="h-6 w-6"
          />
          <span className="whitespace-nowrap font-display text-lg tracking-[-0.02em] text-ink">
            MAIL BUDDY
          </span>
          <span className="pn-annotation mt-1 hidden text-muted-ink lg:inline">
            Issue No. 01
          </span>
        </Link>

        <nav className="hidden items-stretch self-stretch md:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`pn-eyebrow relative flex items-center gap-1.5 border-l border-ink/20 px-5 transition-colors duration-[160ms] last:border-r ${
                isActive(item.href)
                  ? "text-ink"
                  : "text-muted-ink hover:text-ink"
              }`}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              <span
                className={`pn-annotation ${
                  isActive(item.href) ? "text-pink" : "text-muted-ink/60"
                }`}
              >
                {item.index}
              </span>
              {item.label}
              {isActive(item.href) && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-ink" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logout()}
              className="hidden sm:flex"
              aria-label="Log out"
            >
              <LogOut className="mr-2 h-3.5 w-3.5" />
              Log Out
            </Button>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="primary" size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
