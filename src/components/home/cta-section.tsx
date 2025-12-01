import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 sm:py-32 bg-ink text-white">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <h2 className="font-heading text-3xl sm:text-4xl tracking-tight mb-6">
          Ready to get started?
        </h2>
        <p className="text-lg text-white/70 mb-10 max-w-xl mx-auto">
          Create your first personalized document in minutes. No account
          required to try.
        </p>
        <Link href="/create">
          <Button size="lg" className="bg-terracotta hover:bg-terracotta/90 gap-2">
            Create your first merge
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}

