import React from "react";

const MovieCard = ({ movie, onMarkWatched, onDelete }) => {
  const defaultPoster = "https://placeholder.com";

  return (
    <div className="movie-card">
      <div className="poster-wrapper">
        <img src={movie.poster || defaultPoster} alt={movie.title} className="movie-poster" />
      </div>
      <div className="movie-card-content">
        <h3 title={movie.title}>{movie.title}</h3>
        <span className={`language ${movie.language.toLowerCase()}`}>{movie.language}</span>
        <p>{movie.year}</p>
        <div className="movie-card-buttons">
          {/* Changed movie.id to movie._id below */}
          {!movie.watched && (
            <button className="mark-watched" onClick={() => onMarkWatched(movie._id)}>
              Mark Watched
            </button>
          )}
          <button className="delete" onClick={() => onDelete(movie._id)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
