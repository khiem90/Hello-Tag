"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteFooter() {
  const pathname = usePathname();

  // The editor is a full-viewport studio with its own chrome.
  if (pathname === "/create") return null;

  return (
    <footer className="mt-auto border-t border-ink bg-ink text-white-ink">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 py-12 sm:px-9 md:grid-cols-[1fr_1fr_250px]">
        <div className="grid grid-cols-[auto_auto] items-center justify-start gap-x-6">
          <span className="pn-kicker text-white-ink/50">The colophon</span>
          <b className="font-display text-[19px] tracking-[-0.02em]">
            MAIL BUDDY
          </b>
          <i className="pn-hand col-span-2 mt-2 -rotate-1 not-italic text-pink">
            design once, make many!
          </i>
        </div>

        <nav
          className="flex flex-col gap-3 md:flex-row md:gap-6"
          aria-label="Footer navigation"
        >
          {[
            { href: "/templates", label: "A. Specimens" },
            { href: "/create", label: "B. Process" },
            { href: "/about", label: "C. Details" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="pn-kicker text-white-ink/70 transition-colors duration-[160ms] hover:text-white-ink hover:underline hover:decoration-2 hover:underline-offset-4"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="md:text-right">
          <p
            className="font-mono text-[22px] leading-none tracking-[-5px]"
            aria-hidden="true"
          >
            |||| || ||||
          </p>
          <small className="pn-annotation mt-1 block text-white-ink/50">
            © {new Date().getFullYear()} / Warm digital paper
          </small>
        </div>
      </div>
    </footer>
  );
}
