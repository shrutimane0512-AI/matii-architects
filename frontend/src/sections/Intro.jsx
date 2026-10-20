import { Link } from 'react-router-dom';
import './Intro.css';

const PILLARS = [
  { tone: 'sage', title: 'Rooted', text: 'Buildings shaped by their climate, site and the people who live in them.' },
  { tone: 'terracotta', title: 'Crafted', text: 'Honest materials — earth, lime, stone and timber — put together with care.' },
  { tone: 'stone', title: 'Lasting', text: 'Calm, durable spaces designed to age gracefully over generations.' },
];

export default function Intro() {
  return (
    <>
      <section id="intro" className="section section--paper intro">
        <div className="container intro__grid">
          <div>
            <p className="eyebrow">माती · Matii · Earth</p>
            <h2>Architecture that begins with the soil beneath it.</h2>
          </div>
          <div>
            <p>
              Matii means earth. Our practice designs homes, workplaces and public spaces that
              feel grounded — using local materials, natural light and passive cooling to create
              architecture that belongs to its place.
            </p>
            <Link to="/projects" className="btn">
              View our projects
            </Link>
          </div>
        </div>
      </section>

      <section className="pillars" aria-label="Our values">
        {PILLARS.map(({ tone, title, text }) => (
          <article key={title} className={`pillar pillar--${tone}`}>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </section>
    </>
  );
}
