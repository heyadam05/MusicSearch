import { useState } from "react";
import type { FormEvent } from "react";
import {
  FiDisc,
  FiMusic,
  FiPlay,
  FiSearch,
  FiTrendingUp,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import { useTrendingSearches } from "../../hooks/useTrendingSearches";

const features = [
  {
    icon: <FiMusic />,
    title: "Millions of Songs",
    text: "Explore a massive library of songs from all your favorite artists.",
  },
  {
    icon: <FiDisc />,
    title: "Albums & Details",
    text: "Discover album info, tracklists, release dates and more in one place.",
  },
  {
    icon: <FiPlay />,
    title: "30s Preview",
    text: "Listen to 30-second previews before you add songs to your favorites.",
  },
];

export function Home() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const trends = useTrendingSearches();

  const search = (value: string) => {
    const trimmed = value.trim();
    navigate(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    search(query);
  };

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.equalizer} aria-hidden="true">
          {Array.from({ length: 24 }, (_, index) => (
            <i key={index} />
          ))}
        </div>
        <div className={`container ${styles.heroContent}`}>
          <h1>
            Discover Your
            <span>Favorite Music</span>
          </h1>
          <p>
            Search millions of songs, albums and artists.
            <br />
            Listen to previews and find your next favorite track.
          </p>
          <form className={styles.search} onSubmit={handleSubmit}>
            <FiSearch aria-hidden="true" />
            <label className={styles.srOnly} htmlFor="home-search">
              Search music
            </label>
            <input
              id="home-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search for songs, artists, albums..."
            />
            <button type="submit">Search</button>
          </form>
          <div className={styles.trending}>
            <div className={styles.trendingLabel}>
              <FiTrendingUp aria-hidden="true" />
              <span>Trending searches</span>
            </div>
            <div className={styles.chips}>
              {trends.length > 0
                ? trends.map((trend) => (
                    <button
                      key={trend}
                      type="button"
                      onClick={() => search(trend)}
                    >
                      {trend}
                    </button>
                  ))
                : Array.from({ length: 5 }, (_, index) => (
                    <span
                      className={styles.trendSkeleton}
                      key={index}
                      aria-hidden="true"
                    />
                  ))}
            </div>
          </div>
        </div>
      </section>

      <section
        className={`container ${styles.features}`}
        aria-labelledby="features-title"
      >
        <h2 id="features-title">Why Music Search?</h2>
        <div className={styles.featureGrid}>
          {features.map((feature) => (
            <article key={feature.title} className={styles.featureCard}>
              <div className={styles.featureIcon} aria-hidden="true">
                {feature.icon}
              </div>
              <div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
