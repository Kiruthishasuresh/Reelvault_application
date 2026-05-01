import React, { useState } from "react";
import { FiStar, FiCheck, FiTrash2, FiEye, FiEyeOff } from "react-icons/fi";
import { motion } from "framer-motion";
import { useMovies } from "../context/MovieContext";

const MovieCard = ({ movie, index }) => {
  const { toggleWatched, deleteMovie, updateRating } = useMovies();
  const [hoverRating, setHoverRating] = useState(0);

  const handleRate = async (rating) => {
    try { await updateRating(movie._id, rating); } catch {}
  };

  const posterUrl = movie.poster || "https://via.placeholder.com/300x450/1a1a2e/555?text=No+Poster";

  return (
    <motion.div
      className="movie-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      layout
    >
      <div className="poster-wrapper">
        <img src={posterUrl} alt={movie.title} className="movie-poster" loading="lazy" />
        {movie.watched && <span className="watched-badge">✓ Watched</span>}
        <div className="poster-overlay">
          <div className="overlay-actions">
            <button
              className={`overlay-btn watch ${movie.watched ? "watched-active" : ""}`}
              onClick={() => toggleWatched(movie._id)}
              title={movie.watched ? "Mark as unwatched" : "Mark as watched"}
            >
              {movie.watched ? <FiEyeOff /> : <FiEye />}
            </button>
            <button
              className="overlay-btn delete"
              onClick={() => deleteMovie(movie._id)}
              title="Delete movie"
            >
              <FiTrash2 />
            </button>
          </div>
          {movie.overview && (
            <p style={{ fontSize: "0.7rem", color: "#ccc", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {movie.overview}
            </p>
          )}
        </div>
      </div>

      <div className="card-content">
        <h3 className="card-title" title={movie.title}>{movie.title}</h3>
        <div className="card-meta">
          <span className="card-year">{movie.year}</span>
          <span className="card-lang">{movie.language}</span>
        </div>
        <div className="card-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${star <= (hoverRating || movie.rating) ? "filled" : ""}`}
              onClick={() => handleRate(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            >
              ★
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default MovieCard;