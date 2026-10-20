import mayurImg from '../assets/team/mayur-sakunde.jpg';
import mayurDetailing from '../assets/team/mayur-detailing.jpg';
import mayurSite from '../assets/team/mayur-site.jpg';
import mayurPlanting from '../assets/team/mayur-planting.jpg';
import sphurtiImg from '../assets/team/sphurti-rawat.jpg';
import sphurtiSite from '../assets/team/sphurti-site.jpg';
import sphurtiInterior from '../assets/team/sphurti-interior.jpg';
import sphurtiPottery from '../assets/team/sphurti-pottery.jpg';
import TeamMember from '../components/TeamMember.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import './About.css';

// Portraits already carry the name band from the brand artwork.
// Each member reveals a bio + photo slideshow on hover (or tap on touch screens).
const TEAM = [
  {
    name: 'Ar. Mayur Sakunde',
    role: 'Co-founder of Matii Architects',
    portrait: mayurImg,
    bio: [
      'Mayur comes from a farming background that has given him a deep-rooted connect with nature and Mother Earth.',
      'With over 15 years of experience, he combines strong technical expertise with a grounded design approach. Known for his sharp eye for detailing, Mayur ensures that every project stands out with uniqueness and perfection.',
      'His exceptional execution skills and commitment to quality make him a trusted architect who crafts spaces where functionality, precision, and harmony with the environment come together seamlessly.',
      'His practice reflects a balance between structural innovation and ecological awareness, ensuring that every space resonates with both functionality and harmony with its environment.',
    ],
    slides: [
      { type: 'bio' },
      { type: 'image', src: mayurDetailing, alt: 'Mayur aligning hand-painted terracotta plates on a wall' },
      { type: 'image', src: mayurSite, alt: 'Mayur reviewing work with the team on site' },
      { type: 'image', src: mayurPlanting, alt: 'Mayur planting a sapling on the farm' },
    ],
  },
  {
    name: 'Ar. Sphurti Rawat',
    role: 'Co-founder of Matii Architects',
    portrait: sphurtiImg,
    bio: [
      'Sphurti is a born artist whose journey began with a deep-rooted love for nature. Growing up in a family where her father was both a wrestling player and a farmer, she inherited a strong grounding with mati—Mother Earth that continues to shape her design philosophy.',
      'Her early passion for pottery nurtured her artistic sensibility and became a foundation for her career in architecture.',
      'Today, her work reflects a deep respect for natural materials, vernacular wisdom, and the cultural fabric of communities. With experience in architecture, interiors, and landscape, she seamlessly blends sustainability, sensitivity, and contemporary design to craft spaces that are both ecologically responsible and emotionally connected.',
      'For her, true architecture is not just about building, but about creating harmony between tradition and modernity, art and function, people and planet.',
    ],
    slides: [
      { type: 'bio' },
      { type: 'image', src: sphurtiSite, alt: 'Sphurti on site in front of stone houses under construction' },
      { type: 'image', src: sphurtiInterior, alt: 'Sphurti reviewing a finished interior' },
      { type: 'image', src: sphurtiPottery, alt: 'Sphurti painting pottery, beside a potter at the wheel' },
    ],
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="section section--paper">
      <div className="container">
        <SectionHeading
          eyebrow="About us"
          title="The people behind Matii"
          intro="Hover over or tap a portrait to read their story."
        />

        <div className="team">
          {TEAM.map((member) => (
            <TeamMember key={member.name} {...member} />
          ))}
        </div>

        <div className="about">
          <div className="about__text">
            <h3>Why “Matii”?</h3>
            <p>
              <strong>माती (Matii)</strong> is the Marathi word for soil — the most basic and
              honest building material there is. It reminds us that good architecture grows out
              of its ground: its climate, its materials, its craftspeople and its community.
            </p>
            <p>
              We are a small team of architects and designers who work closely with every client.
              Our projects favour natural materials, passive comfort and simple, well-made
              details over fashion — spaces that feel calm today and still feel right decades from
              now.
            </p>
          </div>
          <div className="about__text">
            <h3>Our approach</h3>
            <ul>
              <li>Listen first — every project starts with the people and the site.</li>
              <li>Build with what is local — materials, skills and knowledge.</li>
              <li>Design for climate — light, air and shade before machines.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
