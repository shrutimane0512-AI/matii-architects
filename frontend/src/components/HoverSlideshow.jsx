import { useEffect, useRef, useState } from 'react';
import './HoverSlideshow.css';

/**
 * Shows `cover` normally; on hover (mouse) or tap (touch) fades in an auto-advancing
 * slideshow of `slides` (array of React nodes) with arrows and dots.
 */
export default function HoverSlideshow({ className = '', cover, slides = [], interval = 4000, label }) {
  const [active, setActive] = useState(false);
  const [index, setIndex] = useState(0);
  const pointerType = useRef('mouse');
  const hasSlides = slides.length > 0;

  useEffect(() => {
    if (!active || slides.length < 2) return undefined;
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), interval);
    return () => clearInterval(timer);
  }, [active, index, slides.length, interval]);

  const open = () => hasSlides && setActive(true);
  const close = () => {
    setActive(false);
    setIndex(0);
  };
  const go = (e, i) => {
    e.stopPropagation();
    setIndex((i + slides.length) % slides.length);
  };

  return (
    <div
      className={`slideshow ${className} ${active ? 'is-active' : ''} ${hasSlides ? 'has-slides' : ''}`}
      aria-label={label}
      onPointerEnter={(e) => e.pointerType === 'mouse' && open()}
      onPointerLeave={(e) => e.pointerType === 'mouse' && close()}
      onPointerDown={(e) => (pointerType.current = e.pointerType)}
      onClick={() => {
        // Mouse users already opened it by hovering; a click keeps it open. Touch taps toggle.
        if (pointerType.current === 'mouse' || !active) open();
        else close();
      }}
    >
      {cover}

      {hasSlides && (
        <div className="slideshow__layer" aria-hidden={!active}>
          {slides.map((slide, i) => (
            <div key={i} className={`slideshow__slide ${i === index ? 'is-current' : ''}`}>
              {slide}
            </div>
          ))}

          {slides.length > 1 && (
            <>
              <button className="slideshow__arrow slideshow__arrow--prev" aria-label="Previous" onClick={(e) => go(e, index - 1)}>
                ‹
              </button>
              <button className="slideshow__arrow slideshow__arrow--next" aria-label="Next" onClick={(e) => go(e, index + 1)}>
                ›
              </button>
              <div className="slideshow__dots">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Show slide ${i + 1}`}
                    className={i === index ? 'is-current' : ''}
                    onClick={(e) => go(e, i)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
