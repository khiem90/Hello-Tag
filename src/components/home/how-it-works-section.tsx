import Image from "next/image";

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
      "Choose a document type and add merge fields like {{FirstName}} or {{Company}}.",
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
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="max-w-xl">
            <p className="pn-eyebrow text-muted-ink">
              How it works &mdash; a production run
            </p>
            <h2 className="pn-display-l mt-4 font-display text-ink">
              Three simple steps
            </h2>
            <p className="pn-hand mt-4 inline-block -rotate-2 text-ink">
              design once, make many &rarr;
            </p>
          </div>
          <Image
            src="/press-notes/running-forms.svg"
            alt=""
            width={190}
            height={63}
            className="h-auto w-[150px] sm:w-[190px]"
          />
        </div>

        {/* Steps connected by a thin pink leader line */}
        <div className="relative mt-16 grid gap-12 lg:grid-cols-3 lg:gap-8">
          <span
            aria-hidden="true"
            className="absolute -top-7 left-0 right-0 hidden h-px bg-pink lg:block"
          />
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
    <div className="relative border-t border-ink pt-5">
      <span
        aria-hidden="true"
        className="absolute -top-7 left-0 hidden h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-pink lg:block"
      />
      <span className="pn-eyebrow block text-ink">
        Pass {step.number}
      </span>
      <h3 className="pn-display-m mt-4 font-display text-ink">{step.title}</h3>
      <p className="mt-3 max-w-[62ch] font-body text-sm leading-relaxed text-muted-ink">
        {step.description}
      </p>
    </div>
  );
}
