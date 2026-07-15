type FeatureItem = {
  number: string;
  title: string;
  description: string;
  meta?: string;
  annotation?: string;
};

const features: FeatureItem[] = [
  {
    number: "01",
    title: "Visual editor",
    description:
      "Place merge fields exactly where you want them. Drag, drop, and see your design come together in real time.",
    meta: "Canvas / fields",
  },
  {
    number: "02",
    title: "Simple import",
    description:
      "Upload CSV or Excel files. Column headers automatically become merge fields. No configuration needed.",
    meta: "CSV / XLSX",
    annotation: "Headers become fields, automatically",
  },
  {
    number: "03",
    title: "Instant export",
    description:
      "Generate hundreds of personalized documents in seconds. Download as Word files, ready to print or share.",
    meta: "DOCX out",
  },
];

export function FeaturesSection() {
  return (
    <section className="border-y border-ink bg-cream py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="pn-eyebrow text-muted-ink">
            Contents &mdash; what&apos;s in the kit
          </p>
          <h2 className="pn-display-l mt-4 font-display text-ink">
            Thoughtfully designed
          </h2>
          <p className="mt-5 max-w-[62ch] font-body text-base leading-relaxed text-muted-ink">
            Every detail considered. From import to export, we&apos;ve crafted
            an experience that feels natural and effortless.
          </p>
        </div>

        <div className="mt-14 border-t border-ink">
          {features.map((feature) => (
            <FeatureRow key={feature.number} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

type FeatureRowProps = {
  feature: FeatureItem;
};

function FeatureRow({ feature }: FeatureRowProps) {
  return (
    <div className="grid gap-3 border-b border-ink py-9 md:grid-cols-12 md:items-baseline md:gap-6">
      <span className="pn-eyebrow text-ink md:col-span-2">
        {feature.number} &mdash;
      </span>

      <h3 className="pn-display-m font-display text-ink md:col-span-4">
        {feature.title}
      </h3>

      <div className="md:col-span-6">
        <p className="max-w-[62ch] font-body text-sm leading-relaxed text-ink">
          {feature.description}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          {feature.meta ? (
            <span className="pn-annotation text-muted-ink">{feature.meta}</span>
          ) : null}
          {feature.annotation ? (
            <span className="flex items-center gap-2">
              <span aria-hidden="true" className="h-px w-8 bg-pink" />
              <span
                aria-hidden="true"
                className="-ml-2 h-1.5 w-1.5 rounded-full bg-pink"
              />
              <span className="pn-annotation text-pink">
                {feature.annotation}
              </span>
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
