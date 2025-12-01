import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Layers, Upload, Download } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
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
                Create beautifully personalized letters, certificates, labels, and envelopes. 
                Import your data once, design with care, export with confidence.
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
                      <p className="text-sm text-ink-light mb-2">Dear {"{{FirstName}}"},</p>
                      <p className="font-heading text-2xl text-ink mb-3">Welcome aboard</p>
                      <p className="text-sm text-ink-light leading-relaxed">
                        We&apos;re thrilled to have you join us. Your personalized journey begins here...
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
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="h-px bg-linear-to-r from-transparent via-ink/10 to-transparent" />
      </div>

      {/* Features */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl tracking-tight text-ink mb-4">
              Thoughtfully designed
            </h2>
            <p className="text-lg text-ink-light leading-relaxed">
              Every detail considered. From import to export, we&apos;ve crafted 
              an experience that feels natural and effortless.
            </p>
          </div>

          <div className="grid gap-12 sm:gap-16 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="group">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-terracotta/10 text-terracotta transition-colors group-hover:bg-terracotta group-hover:text-white">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-xl tracking-tight text-ink mb-3">
                Visual editor
              </h3>
              <p className="text-ink-light leading-relaxed">
                Place merge fields exactly where you want them. Drag, drop, and see 
                your design come together in real time.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-sage/10 text-sage transition-colors group-hover:bg-sage group-hover:text-white">
                <Upload className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-xl tracking-tight text-ink mb-3">
                Simple import
              </h3>
              <p className="text-ink-light leading-relaxed">
                Upload CSV or Excel files. Column headers automatically become 
                merge fields. No configuration needed.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-ink/5 text-ink transition-colors group-hover:bg-ink group-hover:text-white">
                <Download className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-xl tracking-tight text-ink mb-3">
                Instant export
              </h3>
              <p className="text-ink-light leading-relaxed">
                Generate hundreds of personalized documents in seconds. 
                Download as Word files, ready to print or share.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 sm:py-32 bg-stone/30">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-20">
            <h2 className="font-heading text-3xl sm:text-4xl tracking-tight text-ink">
              Three simple steps
            </h2>
          </div>
           
          <div className="grid gap-16 lg:grid-cols-3 lg:gap-8">
            {/* Step 1: Design */}
            <div>
              <span className="block font-heading text-sm text-terracotta mb-4">01</span>
              <h3 className="font-heading text-2xl tracking-tight text-ink mb-3">Design</h3>
              <p className="text-ink-light leading-relaxed">
                Choose a document type and add merge fields like {"{{FirstName}}"} or {"{{Company}}"}.
              </p>
            </div>
            
            {/* Step 2: Import */}
            <div>
              <span className="block font-heading text-sm text-terracotta mb-4">02</span>
              <h3 className="font-heading text-2xl tracking-tight text-ink mb-3">Import</h3>
              <p className="text-ink-light leading-relaxed">
                Upload your recipient list from CSV or Excel. Preview each merged document.
              </p>
            </div>
            
            {/* Step 3: Export */}
            <div>
              <span className="block font-heading text-sm text-terracotta mb-4">03</span>
              <h3 className="font-heading text-2xl tracking-tight text-ink mb-3">Export</h3>
              <p className="text-ink-light leading-relaxed">
                Download all your personalized documents in one Word file. Print or share.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl tracking-tight text-ink mb-4">
              Made for everyone
            </h2>
            <p className="text-lg text-ink-light">
              From classrooms to boardrooms, personal to professional.
            </p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Education", desc: "Certificates, report cards, parent letters" },
              { title: "Business", desc: "Client letters, invoices, thank you notes" },
              { title: "Events", desc: "Name badges, place cards, invitations" },
              { title: "Personal", desc: "Holiday cards, wedding stationery, labels" },
            ].map((item) => (
              <div 
                key={item.title}
                className="group rounded-xl border border-ink/5 bg-white p-6 transition-shadow hover:shadow-soft"
              >
                <h3 className="font-heading text-lg tracking-tight text-ink mb-2 group-hover:text-terracotta transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-ink-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32 bg-ink text-white">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl tracking-tight mb-6">
            Ready to get started?
          </h2>
          <p className="text-lg text-white/70 mb-10 max-w-xl mx-auto">
            Create your first personalized document in minutes. 
            No account required to try.
          </p>
          <Link href="/create">
            <Button 
              size="lg" 
              className="bg-terracotta hover:bg-terracotta/90 gap-2"
            >
              Create your first merge
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
