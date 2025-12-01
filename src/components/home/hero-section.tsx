import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div className="max-w-xl">
            <p className="text-sm font-medium text-terracotta mb-4 tracking-wide">
              Mail merge, refined
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl tracking-tight text-ink leading-[1.1] mb-6">
              Personalize with{" "}
              <span className="text-terracotta">intention</span>
            </h1>
            <p className="text-lg text-ink-light leading-relaxed mb-10">
              Create beautifully personalized letters, certificates, labels, and
              envelopes. Import your data once, design with care, export with
              confidence.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/create">
                <Button size="lg" className="gap-2">
                  Start creating
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/templates">
                <Button variant="outline" size="lg">
                  View templates
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Visual */}
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative lg:pl-8">
      <div className="relative aspect-4/3 w-full max-w-lg mx-auto lg:mx-0 lg:ml-auto">
        {/* Document preview cards */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full max-w-sm">
            {/* Back card */}
            <div
              className="absolute top-4 left-4 w-full h-48 rounded-xl bg-stone shadow-soft-sm"
              style={{ transform: "rotate(-3deg)" }}
            />
            {/* Front card */}
            <div className="relative w-full bg-white rounded-xl shadow-soft p-8 border border-ink/5">
              <p className="text-sm text-ink-light mb-2">
                Dear {"{{FirstName}}"},
              </p>
              <p className="font-heading text-2xl text-ink mb-3">
                Welcome aboard
              </p>
              <p className="text-sm text-ink-light leading-relaxed">
                We&apos;re thrilled to have you join us. Your personalized
                journey begins here...
              </p>
              <div className="mt-6 pt-4 border-t border-ink/5">
                <div className="flex items-center gap-2">
                  <span className="inline-block px-2 py-0.5 rounded bg-terracotta-light/50 text-terracotta text-xs font-medium">
                    {"{{Company}}"}
                  </span>
                  <span className="inline-block px-2 py-0.5 rounded bg-sage-light/50 text-sage text-xs font-medium">
                    {"{{Date}}"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

