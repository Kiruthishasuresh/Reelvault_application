import React, { useState, useEffect, useMemo } from "react";
import { FiSearch, FiPlus, FiFilm, FiEye, FiClock, FiStar } from "react-icons/fi";
import { AnimatePresence } from "framer-motion";
import { useMovies } from "../context/MovieContext";
import MovieCard from "../component/MovieCard";
import AddMovieModal from "../component/AddMovieModal";
import Navbar from "../component/Navbar";

const LANGUAGES = ["All", "English", "Tamil", "Hindi", "Telugu", "Malayalam", "Korean", "Japanese"];
const SORT_OPTIONS = [
  { value: "recent", label: "Recently Added" },
  { value: "title", label: "Title A-Z" },
  { value: "year", label: "Year (Newest)" },
  { value: "rating", label: "Highest Rated" },
];

const HomePage = () => {
  const { movies, stats, loading, fetchMovies } = useMovies();
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("All");
  const [sortBy, setSortBy] = useState("recent");
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => { fetchMovies(); }, [fetchMovies]);

  // Client-side filtering & sorting for instant UX
  const filteredMovies = useMemo(() => {
    let result = [...movies];

    // Tab filter
    if (tab === "watchlist") result = result.filter((m) => !m.watched);
    else if (tab === "watched") result = result.filter((m) => m.watched);

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((m) => m.title.toLowerCase().includes(q));
    }

    // Language filter
    if (language !== "All") result = result.filter((m) => m.language === language);

    // Sort
    if (sortBy === "title") result.sort((a, b) => a.title.localeCompare(b.title));
    else if (sortBy === "year") result.sort((a, b) => b.year - a.year);
    else if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);
    else result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return result;
  }, [movies, tab, search, language, sortBy]);

  return (
    <>
      <Navbar />
      <div className="container">
        {/* Stats Bar */}
        <div className="stats-bar">
          <div className="stat-card">
            <div className="stat-icon total"><FiFilm /></div>
            <div className="stat-info"><h4>{stats.total}</h4><p>Total Movies</p></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon watched"><FiEye /></div>
            <div className="stat-info"><h4>{stats.watched}</h4><p>Watched</p></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon unwatched"><FiClock /></div>
            <div className="stat-info"><h4>{stats.unwatched}</h4><p>To Watch</p></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon rating"><FiStar /></div>
            <div className="stat-info"><h4>{stats.avgRating || "—"}</h4><p>Avg Rating</p></div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="toolbar">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input placeholder="Search movies..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          <div className="tabs">
            <button className={`tab-btn ${tab === "all" ? "active" : ""}`} onClick={() => setTab("all")}>
              All<span className="tab-count">{stats.total}</span>
            </button>
            <button className={`tab-btn ${tab === "watchlist" ? "active" : ""}`} onClick={() => setTab("watchlist")}>
              Watchlist<span className="tab-count">{stats.unwatched}</span>
            </button>
            <button className={`tab-btn ${tab === "watched" ? "active" : ""}`} onClick={() => setTab("watched")}>
              Watched<span className="tab-count">{stats.watched}</span>
            </button>
          </div>

          <select className="filter-select" value={language} onChange={(e) => setLanguage(e.target.value)}>
            {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>

          <select className="filter-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          <button className="btn-primary" onClick={() => setShowAddModal(true)} style={{ display: "flex", alignItems: "center", gap: "0.4rem", whiteSpace: "nowrap" }}>
            <FiPlus /> Add Movie
          </button>
        </div>

        {/* Movie Grid */}
        {loading ? (
          <div className="loading-container"><div className="spinner" /></div>
        ) : filteredMovies.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎬</div>
            <h3>{search ? "No movies match your search" : "Your watchlist is empty"}</h3>
            <p>{search ? "Try a different search term" : "Click 'Add Movie' to start building your collection"}</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="movie-grid">
              {filteredMovies.map((movie, i) => (
                <MovieCard key={movie._id} movie={movie} index={i} />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>

      {showAddModal && <AddMovieModal onClose={() => setShowAddModal(false)} />}
    </>
  );
};

export default HomePage;