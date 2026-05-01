import React, { useState } from "react";
import { FiX, FiSearch } from "react-icons/fi";
import { useMovies } from "../context/MovieContext";
import toast from "react-hot-toast";

const LANGUAGES = ["English", "Tamil", "Hindi", "Telugu", "Malayalam", "Kannada", "Korean", "Japanese", "Spanish", "French", "Other"];
const TMDB_KEY = ""; // Users can add their own TMDB API key here

const AddMovieModal = ({ onClose }) => {
  const { addMovie } = useMovies();
  const [form, setForm] = useState({ title: "", year: "", poster: "", language: "English", genre: "", overview: "" });
  const [tmdbResults, setTmdbResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // TMDB search (optional - works only if API key is set)
  const handleTmdbSearch = async () => {
    if (!searchQuery.trim() || !TMDB_KEY) return;
    setSearching(true);
    try {
      const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setTmdbResults(data.results?.slice(0, 5) || []);
    } catch { toast.error("TMDB search failed"); }
    setSearching(false);
  };

  const selectTmdb = (movie) => {
    setForm({
      title: movie.title || "",
      year: movie.release_date?.split("-")[0] || "",
      poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "",
      language: movie.original_language === "en" ? "English" : movie.original_language === "ta" ? "Tamil" : movie.original_language === "hi" ? "Hindi" : "Other",
      genre: "",
      overview: movie.overview || "",
    });
    setTmdbResults([]);
    setSearchQuery("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.year || !form.language) {
      toast.error("Title, year, and language are required");
      return;
    }
    setSubmitting(true);
    try {
      await addMovie({
        ...form,
        year: parseInt(form.year),
        genre: form.genre ? form.genre.split(",").map((g) => g.trim()) : ["Unknown"],
      });
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add movie");
    }
    setSubmitting(false);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Movie</h2>
          <button className="modal-close" onClick={onClose}><FiX /></button>
        </div>

        {TMDB_KEY && (
          <div style={{ marginBottom: "1rem" }}>
            <div className="search-box">
              <FiSearch className="search-icon" />
              <input
                placeholder="Search TMDB for movie data..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTmdbSearch()}
              />
            </div>
            {tmdbResults.length > 0 && (
              <div className="tmdb-search-results">
                {tmdbResults.map((m) => (
                  <div key={m.id} className="tmdb-result" onClick={() => selectTmdb(m)}>
                    {m.poster_path && <img src={`https://image.tmdb.org/t/p/w92${m.poster_path}`} alt="" />}
                    <div className="tmdb-result-info">
                      <strong>{m.title}</strong>
                      <span>{m.release_date?.split("-")[0]}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input className="form-input" name="title" value={form.title} onChange={handleChange} placeholder="Movie title" required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Year *</label>
              <input className="form-input" name="year" type="number" value={form.year} onChange={handleChange} placeholder="2024" min="1888" required />
            </div>
            <div className="form-group">
              <label>Language *</label>
              <select className="form-select" name="language" value={form.language} onChange={handleChange}>
                {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Poster URL</label>
            <input className="form-input" name="poster" value={form.poster} onChange={handleChange} placeholder="https://..." />
          </div>

          <div className="form-group">
            <label>Genres (comma separated)</label>
            <input className="form-input" name="genre" value={form.genre} onChange={handleChange} placeholder="Action, Thriller, Sci-Fi" />
          </div>

          <div className="form-group">
            <label>Overview</label>
            <textarea className="form-input" name="overview" value={form.overview} onChange={handleChange} placeholder="Brief description..." rows="3" style={{ resize: "vertical" }} />
          </div>

          <button className="btn-primary" type="submit" disabled={submitting}>
            {submitting ? "Adding..." : "Add to Watchlist"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMovieModal;
