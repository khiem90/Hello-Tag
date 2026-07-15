import Image from "next/image";

type UseCase = {
  title: string;
  desc: string;
  showRosette?: boolean;
};

const useCases: UseCase[] = [
  {
    title: "Education",
    desc: "Certificates, report cards, parent letters",
    showRosette: true,
  },
  { title: "Business", desc: "Client letters, invoices, thank you notes" },
  { title: "Events", desc: "Name badges, place cards, invitations" },
  { title: "Personal", desc: "Holiday cards, wedding stationery, labels" },
];

export function UseCasesSection() {
  return (
    <section className="border-t border-ink">
      {/* Section header band */}
      <div className="bg-cream">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <p className="pn-eyebrow text-muted-ink">
            Specimens &mdash; who prints with us
          </p>
          <h2 className="pn-display-l mt-4 font-display text-ink">
            Made for everyone
          </h2>
          <p className="mt-5 max-w-[62ch] font-body text-base leading-relaxed text-muted-ink">
            From classrooms to boardrooms, personal to professional.
          </p>
        </div>
      </div>

      {/* Editorial specimen list: alternating sage / cream bands */}
      {useCases.map((item, index) => (
        <SpecimenRow key={item.title} useCase={item} index={index} />
      ))}
    </section>
  );
}

type SpecimenRowProps = {
  useCase: UseCase;
  index: number;
};

function SpecimenRow({ useCase, index }: SpecimenRowProps) {
  const band = index % 2 === 0 ? "bg-sage" : "bg-cream";
  const folio = String(index + 1).padStart(2, "0");

  return (
    <div className={`border-t border-ink ${band}`}>
      <div className="mx-auto grid max-w-6xl gap-2 px-6 py-8 md:grid-cols-12 md:items-baseline md:gap-6">
        <span className="pn-eyebrow text-muted-ink md:col-span-2">
          Spec {folio}
        </span>
        <h3 className="pn-display-m font-display text-ink md:col-span-4">
          {useCase.title}
        </h3>
        <p className="font-body text-sm leading-relaxed text-muted-ink md:col-span-5">
          {useCase.desc}
        </p>
        <div className="md:col-span-1 md:justify-self-end md:self-center">
          {useCase.showRosette ? (
            <Image
              src="/press-notes/rosette.svg"
              alt=""
              width={44}
              height={44}
              aria-hidden="true"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
