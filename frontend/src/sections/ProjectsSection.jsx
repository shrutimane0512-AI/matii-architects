import { useState } from 'react';
import { api } from '../api/client.js';
import { useApi } from '../api/useApi.js';
import SectionHeading from '../components/SectionHeading.jsx';
import Status from '../components/Status.jsx';
import './Projects.css';

const CATEGORIES = ['All', 'Residential', 'Commercial', 'Interior', 'Public'];

export default function ProjectsSection() {
  const [category, setCategory] = useState('All');
  const { data: projects, loading, error } = useApi(
    () => api.getProjects(category === 'All' ? undefined : category),
    [category]
  );

  return (
    <section id="projects" className="section section--paper">
      <div className="container">
        <SectionHeading
          eyebrow="Portfolio"
          title="Our Projects"
          intro="A selection of homes, workplaces and public spaces designed by Matii."
        />

        <div className="filters" role="tablist">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={category === c}
              className={`filter ${category === c ? 'is-active' : ''}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <Status loading={loading} error={error} />

        {projects && (
          <div className="project-grid">
            {projects.map((p) => (
              <article key={p.id} className="project-card">
                <div className={`project-card__visual project-card__visual--${p.tone}`}>
                  <span>{p.title.charAt(0)}</span>
                </div>
                <div className="project-card__body">
                  <p className="eyebrow">
                    {p.category} · {p.year}
                  </p>
                  <h3>{p.title}</h3>
                  <p className="project-card__location">{p.location}</p>
                  <p>{p.summary}</p>
                </div>
              </article>
            ))}
            {projects.length === 0 && <p className="status">No projects in this category yet.</p>}
          </div>
        )}
      </div>
    </section>
  );
}
