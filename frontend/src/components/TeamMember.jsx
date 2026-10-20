import HoverSlideshow from './HoverSlideshow.jsx';
import './TeamMember.css';

/**
 * Portrait that reveals a bio card + photos on hover/click.
 * slides: [{ type: 'bio' } | { type: 'image', src, alt }]
 */
export default function TeamMember({ name, role, portrait, bio = [], slides = [] }) {
  const slideNodes = slides.map((slide) =>
    slide.type === 'bio' ? (
      <div className="member__bio">
        <h3>{name}</h3>
        {role && <p className="member__role">{role}</p>}
        {bio.map((para) => (
          <p key={para.slice(0, 24)}>{para}</p>
        ))}
      </div>
    ) : (
      <img src={slide.src} alt={slide.alt} loading="lazy" />
    )
  );

  return (
    <HoverSlideshow
      className="member"
      label={name}
      cover={<img className="member__portrait" src={portrait} alt={name} />}
      slides={slideNodes}
    />
  );
}
