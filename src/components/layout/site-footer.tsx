import Link from "next/link";
import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-ink bg-ink text-white-ink">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col items-start">
            <p className="pn-annotation text-white-ink/60">The colophon</p>
            <p className="mt-2 font-display text-2xl tracking-[-0.02em]">
              MAIL BUDDY
            </p>
            <p className="pn-hand mt-3 -rotate-2 text-soft-pink">
              design once, make many!
            </p>
          </div>

          <nav
            className="flex flex-col gap-3 md:flex-row md:gap-10"
            aria-label="Footer navigation"
          >
            {[
              { href: "/about", label: "About", index: "A" },
              { href: "/templates", label: "Templates", index: "B" },
              { href: "/create", label: "Merge", index: "C" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="pn-eyebrow group flex items-center gap-2 text-white-ink/70 transition-colors duration-[160ms] hover:text-white-ink"
              >
                <span className="pn-annotation text-pink">{item.index}.</span>
                <span className="group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4">
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>

          <Image
            src="/press-notes/barcode-decorative.svg"
            alt=""
            width={40}
            height={64}
            className="hidden h-16 w-10 opacity-70 md:block"
            aria-hidden="true"
          />
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white-ink/20 pt-6 sm:flex-row">
          <p className="pn-annotation text-white-ink/50">
            © {new Date().getFullYear()} Mail Buddy · Set in Archivo, Inter
            &amp; DM Mono
          </p>
          <p className="pn-annotation text-white-ink/50">
            Printed on warm digital paper
          </p>
        </div>
      </div>
    </footer>
  );
}
