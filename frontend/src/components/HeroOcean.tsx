// @ts-nocheck
import React, { useEffect } from 'react';
import '../styles/hero-ocean.css';

const HeroOcean: React.FC = () => {
  useEffect(() => {
    const root = document.documentElement;

    const handleVisibility = () => {
      if (document.hidden) {
        root.setAttribute('data-hero-paused', 'true');
      } else {
        root.removeAttribute('data-hero-paused');
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    handleVisibility();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      root.removeAttribute('data-hero-paused');
    };
  }, []);

  return (
    <section className="hero-ocean" aria-label="Cinematic pirate ocean hero">
      <div className="ocean-bg" aria-hidden="true">
        <div className="ocean-bg__stars" />
        <div className="ocean-bg__texture" />
      </div>

      <div className="wave wave-1" aria-hidden="true" />
      <div className="wave wave-2" aria-hidden="true" />
      <div className="wave wave-3" aria-hidden="true" />

      <div className="shimmer" aria-hidden="true" />
      <div className="fog fog-a" aria-hidden="true" />
      <div className="fog fog-b" aria-hidden="true" />

      <div className="ship-layer" aria-hidden="true">
        <div className="ship-inner">
          <svg className="ship" viewBox="0 0 320 200" role="img" aria-label="Pirate ship silhouette">
            <path
              d="M23 148h274c-7 18-26 34-48 40l-63 12-63-12c-22-6-41-22-48-40Z"
              fill="rgba(12,26,43,0.9)"
              stroke="rgba(228,199,106,0.3)"
              strokeWidth="3"
            />
            <path
              d="M118 54 160 12l42 42-42 18-42-18Zm42-42 48 18-6 42-42-18V12Zm0 0-48 18 6 42 42-18V12Z"
              fill="rgba(12,26,43,0.95)"
              stroke="rgba(228,199,106,0.25)"
              strokeWidth="2"
            />
            <path
              d="M160 24v120"
              stroke="rgba(228,199,106,0.4)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M208 50 260 22v80l-52-22V50Z"
              fill="rgba(12,26,43,0.92)"
              stroke="rgba(228,199,106,0.25)"
              strokeWidth="3"
            />
            <path
              d="M112 50 60 22v86l52-28V50Z"
              fill="rgba(12,26,43,0.9)"
              stroke="rgba(228,199,106,0.25)"
              strokeWidth="3"
            />
            <path
              d="M160 24 120 8v22l40-6Zm0 0 40-6V8l-40 16Z"
              fill="rgba(228,199,106,0.18)"
            />
          </svg>
          <div className="spray" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>

      <div className="content">
        <div className="content__inner">
          <h1>The Treasure of Seychelles</h1>
          <p>
            In 1730, the pirate Olivier Levasseur—La Buse—flung a cipher to the crowd and dared the world: “Find my treasure, he who can!”
            Three centuries later, the trail stirs again. Among granite peaks and hidden coves of the Seychelles, bearings whisper, tides conceal,
            and strange marks stain old stone. This saga begins at sea: follow the wake, read the sky, and trust the stars. Each clue folds into the
            next—compass arcs, reef angles, and signs cut by iron. Step aboard. The map is not on paper alone—it moves with wind, water, and time.
          </p>
          <div className="content__actions">
            <a className="cta-btn primary" href="/gallery">Explore NFTs</a>
            <a className="cta-btn secondary" href="/puzzle">Solve the Puzzle</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroOcean;
