import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero.jsx';
import Intro from '../sections/Intro.jsx';
import ProjectsSection from '../sections/ProjectsSection.jsx';
import ServicesSection from '../sections/ServicesSection.jsx';
import AboutSection from '../sections/AboutSection.jsx';
import ContactSection from '../sections/ContactSection.jsx';

/** Single scrolling page. /projects, /services, … render this page and scroll to that section. */
export default function Home() {
  const { pathname, key } = useLocation();

  useEffect(() => {
    // Jump instantly on first load, glide when navigating from the header
    const behavior = key === 'default' ? 'auto' : 'smooth';
    const id = pathname.replace(/^\//, '');
    const scrollToTarget = (b) => {
      const target = id && document.getElementById(id);
      if (target) target.scrollIntoView({ behavior: b });
      else window.scrollTo({ top: 0, behavior: b });
    };
    scrollToTarget(behavior);

    // Projects/services load from the API after this runs and push later sections down.
    // On a direct visit (e.g. /contact), keep the target pinned until the layout settles
    // or the visitor starts scrolling themselves.
    if (key !== 'default' || !id) return undefined;
    const stop = () => {
      observer.disconnect();
      clearTimeout(timer);
      ['wheel', 'touchstart', 'keydown'].forEach((evt) => window.removeEventListener(evt, stop));
    };
    const observer = new ResizeObserver(() => scrollToTarget('auto'));
    observer.observe(document.body);
    const timer = setTimeout(stop, 2500);
    ['wheel', 'touchstart', 'keydown'].forEach((evt) => window.addEventListener(evt, stop, { passive: true }));
    return stop;
  }, [pathname, key]);

  return (
    <>
      <Hero />
      <Intro />
      <ProjectsSection />
      <ServicesSection />
      <AboutSection />
      <ContactSection />
    </>
  );
}
