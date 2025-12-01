type UseCase = {
  title: string;
  desc: string;
};

const useCases: UseCase[] = [
  { title: "Education", desc: "Certificates, report cards, parent letters" },
  { title: "Business", desc: "Client letters, invoices, thank you notes" },
  { title: "Events", desc: "Name badges, place cards, invitations" },
  { title: "Personal", desc: "Holiday cards, wedding stationery, labels" },
];

export function UseCasesSection() {
  return (
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
          {useCases.map((item) => (
            <UseCaseCard key={item.title} useCase={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

type UseCaseCardProps = {
  useCase: UseCase;
};

function UseCaseCard({ useCase }: UseCaseCardProps) {
  return (
    <div className="group rounded-xl border border-ink/5 bg-white p-6 transition-shadow hover:shadow-soft">
      <h3 className="font-heading text-lg tracking-tight text-ink mb-2 group-hover:text-terracotta transition-colors">
        {useCase.title}
      </h3>
      <p className="text-sm text-ink-light">{useCase.desc}</p>
    </div>
  );
}

