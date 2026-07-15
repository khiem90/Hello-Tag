import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const values = [
  {
    number: "01",
    title: "Simple first",
    description:
      "Why use a complicated tool when you can use something intuitive?",
  },
  {
    number: "02",
    title: "For everyone",
    description: "Simple enough for beginners, powerful enough for pros.",
  },
  {
    number: "03",
    title: "Made with care",
    description: "Crafted by designers who love personalization.",
  },
];

const documentTypes = ["Letters", "Certificates", "Labels", "Envelopes"];

export default function AboutPage() {
  return (
    <div className="min-h-screen py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* Colophon header */}
        <div className="max-w-3xl">
          <p className="pn-kicker text-muted-ink">
            Colophon / Our story
          </p>
          <h1 className="pn-display-xl mt-6 font-display text-ink">
            About Mail Buddy
          </h1>

          <div className="relative mt-10">
            <p className="max-w-[62ch] font-body text-lg leading-relaxed text-ink">
              We believe mail merge shouldn&apos;t be complicated. That&apos;s
              why we built Mail Buddy.
            </p>
            <p className="mt-5 max-w-[62ch] font-body text-base leading-relaxed text-muted-ink">
              Whether you&apos;re a teacher sending personalized letters to
              parents, an HR manager creating employee certificates, or a small
              business owner mailing thank-you cards, we&apos;re here to make
              the process as simple as possible.
            </p>
            <p className="pn-hand mt-6 inline-block -rotate-2 text-ink">
              still set one letter at a time, just faster
            </p>
          </div>
        </div>

        {/* Document types strip */}
        <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-4 border-y border-ink py-6">
          <span className="pn-annotation text-pink">Printed formats</span>
          {documentTypes.map((type) => (
            <span key={type} className="pn-eyebrow text-ink">
              {type}
            </span>
          ))}
        </div>

        {/* Manifesto: numbered index rows instead of icon cards */}
        <div className="mt-16">
          <p className="pn-kicker text-muted-ink">
            Manifesto / Three rules we print by
          </p>
          <div className="mt-8 border-t border-ink">
            {values.map((value) => (
              <div
                key={value.number}
                className="grid gap-3 border-b border-ink py-8 md:grid-cols-12 md:items-baseline md:gap-6"
              >
                <span className="pn-eyebrow text-ink md:col-span-2">
                  {value.number} &mdash;
                </span>
                <h3 className="pn-display-m font-display text-ink md:col-span-4">
                  {value.title}
                </h3>
                <p className="pn-serif max-w-[52ch] text-[13px] leading-relaxed text-muted-ink md:col-span-6">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Print imprint: mono metadata block */}
        <div className="mt-16 max-w-md border border-ink bg-cream p-6">
          <p className="pn-eyebrow border-b border-ink pb-3 text-ink">
            Imprint
          </p>
          <dl className="mt-4 space-y-2 font-mono text-[11px] uppercase leading-[16px] tracking-[0.06em] text-muted-ink">
            <div className="flex justify-between gap-6">
              <dt>Publication</dt>
              <dd className="text-ink">Mail Buddy &middot; Press Notes</dd>
            </div>
            <div className="flex justify-between gap-6">
              <dt>Issue</dt>
              <dd className="text-ink">01</dd>
            </div>
            <div className="flex justify-between gap-6">
              <dt>Set in</dt>
              <dd className="text-ink">Archivo / Inter / DM Mono / Caveat</dd>
            </div>
            <div className="flex justify-between gap-6">
              <dt>Printed on</dt>
              <dd className="text-ink">Sage &amp; cream stock</dd>
            </div>
          </dl>
        </div>

        {/* Closing CTA band */}
        <div className="pn-noise relative mt-20 border border-ink bg-ink p-10 text-white-ink sm:p-14">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-9">
              <h2 className="pn-display-m font-display text-white-ink">
                Ready to start?
              </h2>
              <p className="mt-4 max-w-[62ch] font-body text-base leading-relaxed text-white-ink/80">
                Jump into the editor and create personalized documents today.
              </p>
              <Link href="/create" className="mt-8 inline-block">
                <Button variant="secondary" size="lg">
                  Start Merging
                </Button>
              </Link>
            </div>
            <div className="flex justify-center lg:col-span-3">
              <Image
                src="/press-notes/oval-stamp.svg"
                alt="Approved for print stamp"
                width={110}
                height={68}
                className="animate-stamp-in -rotate-6"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
