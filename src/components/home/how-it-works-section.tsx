type Step = {
  number: string;
  title: string;
  description: string;
};

const steps: Step[] = [
  {
    number: "01",
    title: "Design",
    description:
      'Choose a document type and add merge fields like {{FirstName}} or {{Company}}.',
  },
  {
    number: "02",
    title: "Import",
    description:
      "Upload your recipient list from CSV or Excel. Preview each merged document.",
  },
  {
    number: "03",
    title: "Export",
    description:
      "Download all your personalized documents in one Word file. Print or share.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 sm:py-32 bg-stone/30">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-20">
          <h2 className="font-heading text-3xl sm:text-4xl tracking-tight text-ink">
            Three simple steps
          </h2>
        </div>

        <div className="grid gap-16 lg:grid-cols-3 lg:gap-8">
          {steps.map((step) => (
            <StepCard key={step.number} step={step} />
          ))}
        </div>
      </div>
    </section>
  );
}

type StepCardProps = {
  step: Step;
};

function StepCard({ step }: StepCardProps) {
  return (
    <div>
      <span className="block font-heading text-sm text-terracotta mb-4">
        {step.number}
      </span>
      <h3 className="font-heading text-2xl tracking-tight text-ink mb-3">
        {step.title}
      </h3>
      <p className="text-ink-light leading-relaxed">{step.description}</p>
    </div>
  );
}

