import { Layers, Upload, Download, LucideIcon } from "lucide-react";

type FeatureItem = {
  icon: LucideIcon;
  iconBg: string;
  title: string;
  description: string;
};

const features: FeatureItem[] = [
  {
    icon: Layers,
    iconBg: "bg-terracotta/10 text-terracotta group-hover:bg-terracotta group-hover:text-white",
    title: "Visual editor",
    description:
      "Place merge fields exactly where you want them. Drag, drop, and see your design come together in real time.",
  },
  {
    icon: Upload,
    iconBg: "bg-sage/10 text-sage group-hover:bg-sage group-hover:text-white",
    title: "Simple import",
    description:
      "Upload CSV or Excel files. Column headers automatically become merge fields. No configuration needed.",
  },
  {
    icon: Download,
    iconBg: "bg-ink/5 text-ink group-hover:bg-ink group-hover:text-white",
    title: "Instant export",
    description:
      "Generate hundreds of personalized documents in seconds. Download as Word files, ready to print or share.",
  },
];

export function FeaturesSection() {
  return (
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
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

type FeatureCardProps = {
  feature: FeatureItem;
};

function FeatureCard({ feature }: FeatureCardProps) {
  const Icon = feature.icon;
  return (
    <div className="group">
      <div
        className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg transition-colors ${feature.iconBg}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-heading text-xl tracking-tight text-ink mb-3">
        {feature.title}
      </h3>
      <p className="text-ink-light leading-relaxed">{feature.description}</p>
    </div>
  );
}

