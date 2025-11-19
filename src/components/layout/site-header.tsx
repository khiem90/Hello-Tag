"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/layout/auth-provider";
import { Button } from "@/components/ui/button";
import { Printer, Tag, LayoutTemplate, User, LogOut } from "lucide-react";

export function SiteHeader() {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { href: "/create", label: "Create", icon: Tag },
    { href: "/templates", label: "Templates", icon: LayoutTemplate },
  ];

  if (isAuthenticated) {
    navItems.push({ href: "/my-labels", label: "My Labels", icon: User });
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-black bg-white/90 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-bubble-blue border-2 border-black shadow-cartoon-sm">
            <Printer className="h-6 w-6 text-white" />
          </div>
          <span className="font-heading text-2xl font-bold tracking-tight text-soft-graphite">
            Label<span className="text-bubble-blue">Buddy</span>
          </span>
        </Link>

        <nav className="hidden gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-2 rounded-full px-4 py-1.5 font-heading font-bold transition-colors ${
                isActive(item.href)
                  ? "bg-sunshine-yellow text-soft-graphite border-2 border-black"
                  : "text-slate-500 hover:text-soft-graphite hover:bg-warm-cloud"
              }`}
            >
              <item.icon className={`h-4 w-4 ${isActive(item.href) ? "text-black" : "group-hover:text-bubble-blue"}`} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logout()}
              className="hidden sm:flex"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
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

