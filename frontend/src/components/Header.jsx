import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_SECTIONS } from './navSections.js';
import './Header.css';

/** Highlights the nav item for whichever section is crossing the middle of the screen. */
function useActiveSection(pathname) {
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const sections = NAV_SECTIONS.map(({ id }) => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );
    sections.forEach((s) => observer.observe(s));

    // Clear the highlight when back up at the hero / intro
    const onScroll = () => {
      if (window.scrollY < sections[0].offsetTop - window.innerHeight / 2) setActiveId(null);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [pathname]);

  return activeId;
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const { pathname, key } = useLocation();
  const activeId = useActiveSection(pathname);

  useEffect(() => setOpen(false), [pathname, key]);

  return (
    <header className="header">
      <Link to="/" className="header__logo">
        MATIIARCHITECTS
      </Link>

      <button
        className="header__toggle"
        aria-label="Toggle navigation"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span />
        <span />
        <span />
      </button>

      <nav className={`header__nav ${open ? 'is-open' : ''}`}>
        {NAV_SECTIONS.map(({ id, label }) => (
          <Link
            key={id}
            to={`/${id}`}
            className={`header__link ${activeId === id ? 'active' : ''}`}
            aria-current={activeId === id ? 'true' : undefined}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
