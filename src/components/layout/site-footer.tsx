import Link from "next/link";
import { Heart } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-slate-200 bg-white px-4 py-10 sm:px-6 lg:px-8 mt-auto">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex flex-col items-center md:items-start">
          <p className="font-heading text-xl font-bold text-soft-graphite">
            Mail<span className="text-bubble-blue">Buddy</span>
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Make mail merge fun!
          </p>
        </div>

        <div className="flex items-center gap-1 text-sm text-slate-500">
          <span>Made with</span>
          <Heart className="h-4 w-4 fill-candy-coral text-candy-coral animate-pulse" />
          <span>for organized people everywhere.</span>
        </div>

        <div className="flex gap-6 text-sm font-bold text-slate-600">
          <Link href="/about" className="hover:text-bubble-blue">
            About
          </Link>
          <Link href="/templates" className="hover:text-bubble-blue">
            Templates
          </Link>
          <Link href="/create" className="hover:text-bubble-blue">
            Merge
          </Link>
        </div>
      </div>
    </footer>
  );
}

