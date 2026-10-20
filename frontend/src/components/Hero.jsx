import { useEffect, useRef, useState } from 'react';
import maImg from '../assets/hero/ma.png';
import logoImg from '../assets/hero/matii-logo.png';
import tiiImg from '../assets/hero/tii.png';
import './Hero.css';

// Hovering (or tapping) a tile expands it and slides in a panel explaining the word.
// `meaning` is one array entry per line.
const PANELS = [
  {
    key: 'ma',
    src: maImg,
    alt: 'ma — on sage green plaster',
    meaning: ['Modern', 'forms, rooted', 'in tradition.'],
  },
  {
    key: 'matii',
    src: logoImg,
    alt: 'Matii logo — माती in a circle',
    meaning: ['माती — earth.', 'The ground every', 'design grows from.'],
  },
  {
    key: 'tii',
    src: tiiImg,
    alt: 'tii — on grey stone',
    meaning: ['Timeless', 'spaces, crafted', 'to belong.'],
  },
];

const HOVER_DELAY_MS = 120; // ignore the cursor just passing across a tile

export default function Hero() {
  const [active, setActive] = useState(null);
  const [shown, setShown] = useState(PANELS[0]); // keeps text visible while the panel closes
  const timer = useRef();

  useEffect(() => () => clearTimeout(timer.current), []);

  const activate = (panel) => {
    setShown(panel);
    setActive(panel.key);
  };

  const handleEnter = (panel) => (e) => {
    if (e.pointerType !== 'mouse') return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => activate(panel), HOVER_DELAY_MS);
  };

  const handleHeroLeave = (e) => {
    if (e.pointerType !== 'mouse') return;
    clearTimeout(timer.current);
    setActive(null);
  };

  // Touch: tap toggles. Mouse: click activates immediately.
  const handleClick = (panel) => () => {
    clearTimeout(timer.current);
    if (active === panel.key) setActive(null);
    else activate(panel);
  };

  return (
    <section
      className={`hero ${active ? `has-active is-${active}` : ''}`}
      aria-label="Matii Architects"
      onPointerLeave={handleHeroLeave}
    >
      {PANELS.map((panel) => (
        <div
          key={panel.key}
          className={`hero__panel hero__panel--${panel.key} ${active === panel.key ? 'is-active' : ''}`}
          onPointerEnter={handleEnter(panel)}
          onPointerLeave={() => clearTimeout(timer.current)}
          onClick={handleClick(panel)}
        >
          <img className="hero__cover" src={panel.src} alt={panel.alt} />
        </div>
      ))}

      <div className="hero__text" aria-live="polite" onClick={() => setActive(null)}>
        <p>
          {shown.meaning.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </p>
      </div>
    </section>
  );
}
