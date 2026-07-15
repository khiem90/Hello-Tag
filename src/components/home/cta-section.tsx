import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="pn-noise relative border-t border-ink bg-ink py-20 text-white-ink sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="pn-annotation text-pink">
              Final pass &mdash; approved for print
            </p>
            <h2 className="pn-display-l mt-4 font-display text-white-ink">
              Ready to get started?
            </h2>
            <p className="mt-6 max-w-[62ch] font-body text-base leading-relaxed text-white-ink/80">
              Create your first personalized document in minutes. No account
              required to try.
            </p>
            <Link href="/create" className="mt-10 inline-block">
              <Button variant="secondary" size="lg">
                Create your first merge &rarr;
              </Button>
            </Link>
          </div>

          <div className="relative flex justify-center py-6 lg:col-span-4">
            <Image
              src="/press-notes/ink-burst.svg"
              alt=""
              width={72}
              height={72}
              aria-hidden="true"
              className="absolute right-6 top-0"
            />
            <Image
              src="/press-notes/oval-stamp.svg"
              alt="Approved for print stamp"
              width={120}
              height={75}
              className="animate-stamp-in -rotate-6"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
