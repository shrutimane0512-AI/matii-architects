export default function SectionHeading({ eyebrow, title, intro }) {
  return (
    <header className="section-heading">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      {intro && <p className="section-heading__intro">{intro}</p>}
    </header>
  );
}
