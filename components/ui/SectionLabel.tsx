import type { ReactNode } from "react";

type SectionLabelProps = { number: string; children: ReactNode };

export function SectionLabel({ number, children }: SectionLabelProps) {
  return (
    <p className="section-label">
      <span>{number}</span>
      <span className="section-label__line" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}
