import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Heart, Star, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="text-sm font-medium text-terracotta mb-3 tracking-wide">
            Our story
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl tracking-tight text-ink mb-6">
            About MailBuddy
          </h1>
          
          <p className="text-lg text-ink-light leading-relaxed mb-6">
            We believe mail merge shouldn&apos;t be complicated. That&apos;s why we built MailBuddy.
          </p>
          <p className="text-ink-light leading-relaxed">
            Whether you&apos;re a teacher sending personalized letters to parents, an HR manager creating employee certificates, or a small business owner mailing thank-you cards, we&apos;re here to make the process as simple as possible.
          </p>
        </div>

        {/* Document Types */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mb-16 py-8 border-y border-ink/5">
          {["Letters", "Certificates", "Labels", "Envelopes"].map((type) => (
            <span 
              key={type}
              className="text-sm text-ink-light font-medium tracking-wide"
            >
              {type}
            </span>
          ))}
        </div>

        <div className="grid gap-12 sm:grid-cols-3 mb-20">
          <div className="flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-lg bg-terracotta/10 flex items-center justify-center text-terracotta mb-5">
              <Star className="h-5 w-5" />
            </div>
            <h3 className="font-heading text-xl tracking-tight text-ink mb-2">Simple first</h3>
            <p className="text-sm text-ink-light">Why use a complicated tool when you can use something intuitive?</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-lg bg-sage/10 flex items-center justify-center text-sage mb-5">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="font-heading text-xl tracking-tight text-ink mb-2">For everyone</h3>
            <p className="text-sm text-ink-light">Simple enough for beginners, powerful enough for pros.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-lg bg-ink/5 flex items-center justify-center text-ink mb-5">
              <Heart className="h-5 w-5" />
            </div>
            <h3 className="font-heading text-xl tracking-tight text-ink mb-2">Made with care</h3>
            <p className="text-sm text-ink-light">Crafted by designers who love personalization.</p>
          </div>
        </div>

        <div className="rounded-xl bg-ink text-white p-10 sm:p-14 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl tracking-tight mb-4">Ready to start?</h2>
          <p className="text-white/70 mb-8 max-w-md mx-auto">
            Jump into the editor and create personalized documents today.
          </p>
          <Link href="/create">
            <Button size="lg" className="bg-terracotta hover:bg-terracotta/90">
              Start Merging
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
