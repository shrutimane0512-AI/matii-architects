import { api } from '../api/client.js';
import { useApi } from '../api/useApi.js';
import SectionHeading from '../components/SectionHeading.jsx';
import Status from '../components/Status.jsx';
import './Services.css';

export default function ServicesSection() {
  const { data: services, loading, error } = useApi(api.getServices);

  return (
    <section id="services" className="section section--cream">
      <div className="container">
        <SectionHeading
          eyebrow="What we do"
          title="Our Services"
          intro="From the first site visit to the final finish, we stay with a project through every stage."
        />
        <Status loading={loading} error={error} />
        {services && (
          <ol className="service-list">
            {services.map((s, i) => (
              <li key={s.id} className="service">
                <span className="service__index">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h2>{s.title}</h2>
                  <p>{s.description}</p>
                  <ul className="service__tags">
                    {s.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
