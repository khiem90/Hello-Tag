import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-20 lg:grid-cols-12 lg:items-center lg:gap-12">
          {/* Editorial title block */}
          <div className="lg:col-span-7">
            <p className="pn-eyebrow animate-fade-up text-muted-ink">
              Press Notes &middot; Issue 01 &mdash; Mail merge, refined
            </p>

            <h1 className="pn-display-xl animate-fade-up delay-1 mt-6 font-display text-ink">
              <span className="block">Design once.</span>
              <span className="block">Make many.</span>
            </h1>

            {/* Pink annotation leader pointing back up at the headline */}
            <div className="animate-fade-up delay-2 relative mt-2 pl-20">
              <span
                aria-hidden="true"
                className="absolute left-6 -top-2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-pink"
              />
              <span
                aria-hidden="true"
                className="absolute left-6 top-0 h-4 w-px bg-pink"
              />
              <span
                aria-hidden="true"
                className="absolute left-6 top-4 h-px w-12 bg-pink"
              />
              <span className="pn-annotation relative top-2 text-pink">
                Your template, n copies
              </span>
            </div>

            <p className="animate-fade-up delay-3 mt-10 max-w-[62ch] font-body text-base leading-relaxed text-ink">
              Mail Buddy runs one careful design against your whole list.
              Letters, certificates, labels, and envelopes &mdash; import your
              data once, place your fields with intention, and export a stack
              of documents that each read like they were made by hand.
            </p>

            <p className="pn-hand animate-fade-up delay-4 mt-5 inline-block -rotate-2 text-ink">
              no mail-merge wizardry required &mdash; promise!
            </p>

            <div className="animate-fade-up delay-5 mt-10 flex flex-wrap gap-4">
              <Link href="/create">
                <Button size="lg">Start merging &rarr;</Button>
              </Link>
              <Link href="/templates">
                <Button variant="secondary" size="lg">
                  Browse templates
                </Button>
              </Link>
            </div>
          </div>

          {/* Document sheet + mascot */}
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="animate-fade-up delay-3 relative mx-auto w-full max-w-sm lg:col-span-5 lg:mx-0">
      {/* Cream document sheet with a tiny fake merge preview */}
      <div className="pn-noise relative rotate-1 border border-ink bg-cream p-7 shadow-paper sm:p-8">
        <p className="pn-eyebrow text-muted-ink">
          Merge preview &mdash; record 001 / 214
        </p>

        <div className="mt-5 border-t border-ink pt-5 font-body text-sm leading-relaxed text-ink">
          <p>
            Dear{" "}
            <span className="pn-field-outline px-1 font-mono">
              {"{{ Full Name }}"}
            </span>
            ,
          </p>
          <p className="mt-3">
            Your seat at{" "}
            <span className="pn-field-outline px-1 font-mono">
              {"{{ Company }}"}
            </span>{" "}
            is confirmed for{" "}
            <span className="pn-field-outline px-1 font-mono">
              {"{{ Date }}"}
            </span>
            . We look forward to seeing you.
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4 border-t border-ink pt-3">
          <span className="pn-annotation text-muted-ink">
            Fields update per record
          </span>
          <Image
            src="/press-notes/barcode-decorative.svg"
            alt=""
            width={25}
            height={40}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Mascot overlapping the sheet */}
      <Image
        src="/press-notes/mascot-printmaker.svg"
        alt="Press Notes printmaker mascot holding a freshly printed label"
        width={180}
        height={180}
        priority
        className="absolute -bottom-12 -left-6 w-[160px] lg:-left-10 lg:w-[180px]"
      />
    </div>
  );
}
