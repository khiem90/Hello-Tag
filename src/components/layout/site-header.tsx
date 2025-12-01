"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/layout/auth-provider";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function SiteHeader() {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { href: "/create", label: "Merge" },
    { href: "/templates", label: "Templates" },
  ];

  if (isAuthenticated) {
    navItems.push({ href: "/my-labels", label: "My Documents" });
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-ink/5 bg-paper/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link 
          href="/" 
          className="flex items-center gap-2 transition-opacity hover:opacity-70"
          aria-label="MailBuddy Home"
        >
          <span className="font-heading text-xl tracking-tight text-ink">
            Mail<span className="text-terracotta">Buddy</span>
          </span>
        </Link>

        <nav className="hidden gap-1 md:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative px-4 py-2 text-sm transition-colors ${
                isActive(item.href)
                  ? "text-ink"
                  : "text-ink-light hover:text-ink"
              }`}
            >
              {item.label}
              {isActive(item.href) && (
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-terracotta rounded-full" />
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
              <LogOut className="mr-2 h-4 w-4" />
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
