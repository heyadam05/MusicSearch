import { useEffect, useMemo, useState } from "react";
import {
  FiClock,
  FiDisc,
  FiFilter,
  FiMusic,
  FiSearch,
  FiTrash2,
  FiVideo,
} from "react-icons/fi";
import { useSearchParams } from "react-router-dom";
import { AlbumCard } from "../../components/music/AlbumCard";
import { MusicCard } from "../../components/music/MusicCard";
import { MusicCardSkeleton } from "../../components/music/MusicCardSkeleton";
import { SearchBar } from "../../components/music/SearchBar";
import { Pagination } from "../../components/search/Pagination";
import { SearchFilters } from "../../components/search/SearchFilters";
import { useMusicSearch } from "../../hooks/useMusicSearch";
import { useRecentSearches } from "../../hooks/useRecentSearches";
import type {
  MusicAlbumSummary,
  MusicTrack,
  SearchMediaType,
  SearchSort,
} from "../../types/music";
import styles from "./Search.module.css";

const PAGE_SIZE = 12;
const CURRENT_YEAR = new Date().getFullYear();
const MEDIA_TYPES: SearchMediaType[] = ["songs", "albums", "videos"];

function isMediaType(value: string | null): value is SearchMediaType {
  return value !== null && MEDIA_TYPES.includes(value as SearchMediaType);
}

function getReleaseYear(item: MusicTrack | MusicAlbumSummary) {
  const year = new Date(item.releaseDate).getFullYear();
  return Number.isFinite(year) ? year : null;
}

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";
  const requestedType = searchParams.get("type");
  const mediaType: SearchMediaType = isMediaType(requestedType)
    ? requestedType
    : "songs";
  const { catalog, isLoading, error, retry } = useMusicSearch(query);
  const {
    items: recentSearches,
    add: addRecentSearch,
    clear: clearRecentSearches,
  } = useRecentSearches();
  const [sort, setSort] = useState<SearchSort>("relevance");
  const [genre, setGenre] = useState("all");
  const [minYear, setMinYear] = useState(1900);
  const [maxYear, setMaxYear] = useState(CURRENT_YEAR);
  const [areFiltersOpen, setAreFiltersOpen] = useState(false);
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const activeItems = catalog[mediaType];

  useEffect(() => {
    if (query) addRecentSearch(query);
  }, [addRecentSearch, query]);

  const genres = useMemo(
    () =>
      [...new Set(activeItems.map((item) => item.genre))].sort((a, b) =>
        a.localeCompare(b),
      ),
    [activeItems],
  );

  const filteredItems = useMemo(() => {
    const result = activeItems.filter((item) => {
      const year = getReleaseYear(item);
      const matchesGenre = genre === "all" || item.genre === genre;
      const matchesYear = year === null || (year >= minYear && year <= maxYear);
      return matchesGenre && matchesYear;
    });

    if (sort === "title") result.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "artist")
      result.sort((a, b) => a.artist.localeCompare(b.artist));
    if (sort === "newest") {
      result.sort(
        (a, b) => Date.parse(b.releaseDate) - Date.parse(a.releaseDate),
      );
    }
    if (sort === "oldest") {
      result.sort(
        (a, b) => Date.parse(a.releaseDate) - Date.parse(b.releaseDate),
      );
    }
    return result;
  }, [activeItems, genre, maxYear, minYear, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visibleItems = filteredItems.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );
  const visibleTracks = visibleItems.filter(
    (item): item is MusicTrack => item.type !== "album",
  );

  const updateSearch = (nextQuery: string) => {
    const normalized = nextQuery.trim();
    setSearchParams(normalized ? { q: normalized } : {});
    resetFilters();
  };

  const updatePage = (nextPage: number) => {
    const next = new URLSearchParams(searchParams);
    if (nextPage <= 1) next.delete("page");
    else next.set("page", String(nextPage));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateMediaType = (nextType: SearchMediaType) => {
    const next = new URLSearchParams(searchParams);
    if (nextType === "songs") next.delete("type");
    else next.set("type", nextType);
    next.delete("page");
    setSearchParams(next);
    setGenre("all");
  };

  function resetFilters() {
    setGenre("all");
    setSort("relevance");
    setMinYear(1900);
    setMaxYear(CURRENT_YEAR);
  }

  return (
    <section className={`container ${styles.page}`}>
      <header className={styles.header}>
        <h1>Search</h1>
        <p>Find your favorite songs, albums and artists.</p>
      </header>

      <div className={styles.searchRow}>
        <SearchBar
          key={query}
          initialValue={query}
          isLoading={isLoading}
          onSearch={updateSearch}
        />
        <button
          className={styles.filterButton}
          type="button"
          onClick={() => setAreFiltersOpen(true)}
        >
          <FiFilter /> Filters
        </button>
      </div>

      {!query && (
        <div className={styles.welcome}>
          <FiSearch aria-hidden="true" />
          <h2>Start searching for your favorite music.</h2>
          <p>Enter a song, artist or album in the search field above.</p>
          {recentSearches.length > 0 && (
            <div className={styles.recent}>
              <div className={styles.recentTitle}>
                <span>
                  <FiClock /> Recent searches
                </span>
                <button type="button" onClick={clearRecentSearches}>
                  <FiTrash2 /> Clear
                </button>
              </div>
              <div className={styles.recentItems}>
                {recentSearches.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => updateSearch(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {query && (
        <>
          <div className={styles.toolbar}>
            <p>
              {isLoading
                ? "Searching…"
                : `About ${filteredItems.length} results for `}
              {!isLoading && <strong>“{query}”</strong>}
            </p>
            <div className={styles.typeSort}>
              <div
                className={styles.tabs}
                role="tablist"
                aria-label="Result type"
              >
                <button
                  className={mediaType === "songs" ? styles.active : ""}
                  type="button"
                  role="tab"
                  aria-selected={mediaType === "songs"}
                  onClick={() => updateMediaType("songs")}
                >
                  <FiMusic /> Songs <span>{catalog.songs.length}</span>
                </button>
                <button
                  className={mediaType === "albums" ? styles.active : ""}
                  type="button"
                  role="tab"
                  aria-selected={mediaType === "albums"}
                  onClick={() => updateMediaType("albums")}
                >
                  <FiDisc /> Albums <span>{catalog.albums.length}</span>
                </button>
                <button
                  className={mediaType === "videos" ? styles.active : ""}
                  type="button"
                  role="tab"
                  aria-selected={mediaType === "videos"}
                  onClick={() => updateMediaType("videos")}
                >
                  <FiVideo /> Videos <span>{catalog.videos.length}</span>
                </button>
              </div>
              <label className={styles.sort}>
                <span>Sort by</span>
                <select
                  value={sort}
                  onChange={(event) => {
                    setSort(event.target.value as SearchSort);
                    updatePage(1);
                  }}
                >
                  <option value="relevance">Relevance</option>
                  <option value="title">Title</option>
                  <option value="artist">Artist</option>
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                </select>
              </label>
            </div>
          </div>

          <div className={styles.content}>
            <div className={styles.results}>
              {isLoading && (
                <div
                  className={styles.grid}
                  aria-label="Loading search results"
                >
                  {Array.from({ length: 8 }, (_, index) => (
                    <MusicCardSkeleton key={index} />
                  ))}
                </div>
              )}

              {error && (
                <div className={styles.message} role="alert">
                  <h2>Something went wrong.</h2>
                  <p>{error}</p>
                  <button type="button" onClick={retry}>
                    Try again
                  </button>
                </div>
              )}

              {!isLoading && !error && filteredItems.length === 0 && (
                <div className={styles.message}>
                  <h2>No {mediaType} found.</h2>
                  <p>Try a different search phrase or reset the filters.</p>
                </div>
              )}

              {!isLoading && !error && visibleItems.length > 0 && (
                <>
                  <div className={styles.grid}>
                    {visibleItems.map((item) =>
                      item.type === "album" ? (
                        <AlbumCard key={item.id} album={item} />
                      ) : (
                        <MusicCard
                          key={item.id}
                          track={item}
                          queue={visibleTracks}
                          favoriteEnabled={item.type === "song"}
                        />
                      ),
                    )}
                  </div>
                  <Pagination
                    currentPage={safePage}
                    totalPages={totalPages}
                    onPageChange={updatePage}
                  />
                </>
              )}
            </div>

            <SearchFilters
              isOpen={areFiltersOpen}
              mediaType={mediaType}
              genre={genre}
              genres={genres}
              minYear={minYear}
              maxYear={maxYear}
              onMediaTypeChange={updateMediaType}
              onGenreChange={(value) => {
                setGenre(value);
                updatePage(1);
              }}
              onMinYearChange={(year) => {
                setMinYear(Math.max(1900, Math.min(year, maxYear)));
                updatePage(1);
              }}
              onMaxYearChange={(year) => {
                setMaxYear(Math.min(CURRENT_YEAR, Math.max(year, minYear)));
                updatePage(1);
              }}
              onReset={() => {
                resetFilters();
                updatePage(1);
              }}
              onClose={() => setAreFiltersOpen(false)}
            />
          </div>
        </>
      )}
    </section>
  );
}
