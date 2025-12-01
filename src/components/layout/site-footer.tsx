import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink/5 bg-paper mt-auto">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex flex-col items-center md:items-start">
            <p className="font-heading text-lg tracking-tight text-ink">
              Mail<span className="text-terracotta">Buddy</span>
            </p>
            <p className="text-sm text-ink-light mt-1">
              Elegant mail merge, simplified.
            </p>
          </div>

          <nav className="flex gap-8 text-sm text-ink-light" aria-label="Footer navigation">
            <Link 
              href="/about" 
              className="transition-colors hover:text-ink"
            >
              About
            </Link>
            <Link 
              href="/templates" 
              className="transition-colors hover:text-ink"
            >
              Templates
            </Link>
            <Link 
              href="/create" 
              className="transition-colors hover:text-ink"
            >
              Merge
            </Link>
          </nav>
        </div>

        <div className="mt-12 pt-6 border-t border-ink/5 text-center">
          <p className="text-xs text-ink-light/60">
            © {new Date().getFullYear()} MailBuddy. Crafted with care.
          </p>
        </div>
      </div>
    </footer>
  );
}
