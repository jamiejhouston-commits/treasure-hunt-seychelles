import HeroOcean from '../components/HeroOcean';
import '../styles/home_pirate_v1.css';

const storySignals = [
  {
    icon: '🗡️',
    title: 'Bearings & Reefs',
    description: 'Angles between islands aren’t random.'
  },
  {
    icon: '☠️',
    title: 'Tides & Stars',
    description: 'Numbers shift with moons and constellations.'
  },
  {
    icon: '🧭',
    title: 'Runes & Marks',
    description: 'Daggers, X’s, and skulls are ciphers, not flair.'
  }
];

const howItWorks = [
  {
    title: 'Collect NFT Clues',
    description: 'Fragments across the archipelago—coordinates, bearings, lore.'
  },
  {
    title: 'Solve the Puzzle',
    description: 'Decode the cryptogram using history, navigation, cryptography.'
  },
  {
    title: 'Win the Treasure',
    description: 'Submit precise coordinates. First to solve claims the one-of-one Treasure NFT.'
  }
];

const legendMoments = [
  {
    year: '1718',
    title: 'Escape from Île Sainte-Marie',
    description: 'La Buse abandons the Caribbean and slips into the western Indian Ocean, trading rumour for reefs and shoals.'
  },
  {
    year: '1721',
    title: 'Nossa Senhora do Cabo',
    description: 'Levasseur and John Taylor seize the Portuguese galleon, capturing the Black Cross of Goa and charts laced with cryptic bearings.'
  },
  {
    year: '1724',
    title: 'Coves of Seychelles',
    description: 'Reports place Levasseur charting Mahé, Silhouette, and the Amirantes—hiding chests among granite arches and tide-carved caves.'
  },
  {
    year: '1730',
    title: 'The Hanging at Réunion',
    description: 'On Île Bourbon he hurls a ciphered necklace into the crowd: “Find my treasure, he who can.” The riddle survives; the trove does not.'
  },
  {
    year: '2025',
    title: 'The XRPL Expedition',
    description: 'Digital cartographers revive the hunt—each NFT a notarised clue, every solver racing to chart La Buse’s final waypoint.'
  }
];

const missionPillars = [
  {
    title: 'Archive the Legend',
    description:
      'We anchor verified folklore, sailor logs, and cartographic cues on-chain so the saga endures beyond fading parchment.'
  },
  {
    title: 'Empower Solvers',
    description:
      'Collectors collaborate through cryptography, celestial navigation, and historical sleuthing—transforming every clue into shared discovery.'
  },
  {
    title: 'Reward the Bold',
    description:
      'The first crew to triangulate La Buse’s coordinates claims the Treasure NFT and its real-world honours.'
  }
];

const galleryImages = [
  {
    src: '/PUBLIC/IMG_2487.JPG',
    title: 'Granite Sentinels',
    alt: 'Field photograph of towering granite boulders along a Seychelles shoreline at dusk.',
    caption: 'Wind-sculpted granite stacks hint at hidden vaults carved by tides and time.'
  },
  {
    src: '/PUBLIC/IMG_2496.JPG',
    title: 'Compass Lagoon',
    alt: 'Field photograph of a calm lagoon reflecting tropical light in the Seychelles.',
    caption: 'Where mangroves meet coral shelves, explorers chart tidal puzzles whispered in Levasseur’s logs.'
  },
  {
    src: '/PUBLIC/IMG_2497.JPG',
    title: 'Nightfall Beacon',
    alt: 'Field photograph of a lantern-lit shoreline lookout in the Seychelles after sunset.',
    caption: 'A lone beacon watching over the reef lanes La Buse once ran under moonlit sails.'
  },
  {
    src: '/PUBLIC/IMG_2513.JPG',
    title: 'Archive in Motion',
    alt: 'Field photograph documenting explorers reviewing charts and notes near the coast.',
    caption: 'Modern cartographers cross-reference colonial charts with NFT metadata to revive the hunt.'
  }
];

const Home = () => (
  <div className="home-page">
    <HeroOcean />

    <section className="story-teaser" aria-labelledby="story-heading">
      <article className="story-teaser__narrative">
        <h2 id="story-heading" className="visually-hidden">Legend of La Buse</h2>
        <p>
          July 7, 1730—Île Bourbon. Moments before the hangman’s drop, Olivier Levasseur rips a necklace from his neck and hurls it toward the crowd. On its copper plates: a substitution cipher rumoured to reveal caches scattered across the Seychelles. Witnesses remember his challenge: “Trouvez mon trésor, qui pourra!”
        </p>
        <p>
          Historians trace his shadow from Madagascar to Mahé. Portuguese accounts describe the plunder of the Nossa Senhora do Cabo; French colonial logs whisper of clandestine landings on Silhouette Island. Today our expedition binds those breadcrumbs to the ledger—each NFT a notarised clue infused with bearings, moon tables, reef sketches, and the lore that kept divers searching for centuries.
        </p>
        <p className="story-teaser__cta-copy">
          Collect the fragments. Cross-reference the stars. Let data, history, and intuition steer you toward La Buse’s final vault.
        </p>
      </article>
      <div className="signals" aria-label="Three discovery signals">
        {storySignals.map((signal) => (
          <div className="signal-item" key={signal.title}>
            <span className="icon" aria-hidden="true">{signal.icon}</span>
            <div>
              <h4>{signal.title}</h4>
              <p>{signal.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    <section className="legend-grid" aria-labelledby="legend-heading">
      <div className="legend-grid__header">
        <h2 id="legend-heading" className="section-title">Levasseur’s Wake</h2>
        <p>
          Each waypoint below is anchored in archival logs, colonial dispatches, and the oral histories that fed the legend. The NFTs echo these chapters, distilling them into puzzles you can actually solve.
        </p>
      </div>
      <div className="legend-grid__items">
        {legendMoments.map((moment) => (
          <article key={moment.year} className="legend-grid__item">
            <span className="legend-grid__year">{moment.year}</span>
            <h3>{moment.title}</h3>
            <p>{moment.description}</p>
          </article>
        ))}
      </div>
    </section>

    <section className="how-it-works" aria-labelledby="how-heading">
      <h2 id="how-heading" className="section-title">How It Works</h2>
      <div className="how-cards">
        {howItWorks.map((card) => (
          <div className="how-card" key={card.title}>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </div>
        ))}
      </div>
      <div className="how-card__actions">
        <a className="cta-btn primary" href="/gallery">Open Gallery</a>
        <a className="cta-btn secondary" href="/puzzle">Go to Puzzle</a>
      </div>
    </section>

    <section className="expedition-gallery" aria-labelledby="gallery-heading">
      <div className="expedition-gallery__intro">
        <h2 id="gallery-heading" className="section-title">Field Dispatch</h2>
        <p>
          Recent reconnaissance stitched the following frames into our dossier. These aren’t stock postcards—they are vantage points informing the clues you collect on-chain. Study the geology, light, and tide lines; they surface in the metadata.
        </p>
      </div>
      <div className="expedition-gallery__grid">
        {galleryImages.map((photo) => (
          <figure key={photo.src} className="expedition-gallery__item">
            <img src={photo.src} alt={photo.alt} loading="lazy" />
            <figcaption>
              <h3>{photo.title}</h3>
              <p>{photo.caption}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>

    <section className="mission" aria-labelledby="mission-heading">
      <div className="mission__header">
        <h2 id="mission-heading" className="section-title">Why the Hunt Matters</h2>
        <p>
          The Levasseur Treasure quest is equal parts historical archive, collaborative game, and on-chain experiment. Every pillar below reinforces the mystery and its modern objective.
        </p>
      </div>
      <div className="mission__pillars">
        {missionPillars.map((pillar) => (
          <article key={pillar.title} className="mission__pillar">
            <h3>{pillar.title}</h3>
            <p>{pillar.description}</p>
          </article>
        ))}
      </div>
      <div className="mission__cta">
        <a className="cta-btn primary" href="/about">Read the Manifest</a>
        <a className="cta-btn secondary" href="/gallery">Survey the Clues</a>
      </div>
    </section>

    <section className="chapter-strip" aria-label="Saga chapters">
      <div className="chapter-strip__content">
        <div className="chapter-strip__chapters">
          Chapter I — Genesis (100) • Chapter II — Outer Islands • Chapter III — Remote Atolls • Chapter IV — Witch-Winds of Mahé
        </div>
        <a className="chapter-strip__link" href="/about">Learn More →</a>
      </div>
    </section>
  </div>
);

export default Home;
