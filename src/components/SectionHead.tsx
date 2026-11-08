import { ReactNode } from "react";

export default function SectionHead({
  index,
  label,
  title,
  id,
  children,
}: {
  index: string;
  label: string;
  title: ReactNode;
  id: string;
  children?: ReactNode;
}) {
  return (
    <header className="section__head">
      <p className="section__index mono">
        <b>{index}</b> {label}
      </p>
      <h2 id={id} className="section__title">
        {title}
      </h2>
      {children && <p className="section__lede">{children}</p>}
    </header>
  );
}
