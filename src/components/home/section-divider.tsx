import Image from "next/image";

export function SectionDivider() {
  return (
    <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-6">
      <span aria-hidden="true" className="h-px flex-1 bg-ink" />
      <Image
        src="/press-notes/loop-mark.svg"
        alt=""
        width={18}
        height={18}
        aria-hidden="true"
      />
      <p className="pn-annotation whitespace-nowrap text-muted-ink">
        Press Notes &middot; Issue 01 &middot; Mail Buddy
      </p>
      <span aria-hidden="true" className="h-px flex-1 bg-ink" />
    </div>
  );
}
