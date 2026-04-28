import React, { useState, useEffect } from "react";
import axios from "axios";
import MovieCard from "../component/MovieCard";

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [tab, setTab] = useState("watchlist");

  useEffect(() => {
    // Calling your backend server
    axios.get("http://localhost:5000/api/movies")
      .then((res) => setMovies(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleMarkWatched = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/movies/${id}`);
      // We use m._id to find the right movie in the list
      setMovies(movies.map((m) => (m._id === id ? res.data : m)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/movies/${id}`);
      // We use m._id to remove it from the list
      setMovies(movies.filter((m) => m._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = movies.filter((m) => tab === "watchlist" ? !m.watched : m.watched);

  return (
    <div className="container">
      <div className="tabs">
        <button onClick={() => setTab("watchlist")} className={tab === "watchlist" ? "active" : ""}>Watchlist</button>
        <button onClick={() => setTab("watched")} className={tab === "watched" ? "active" : ""}>Watched</button>
      </div>
      {filtered.length ? (
        <div className="movie-grid">
          {filtered.map((movie) => (
            <MovieCard key={movie._id} movie={movie} onMarkWatched={handleMarkWatched} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <p className="empty-message">No movies in this list.</p>
      )}
    </div>
  );
};

export default HomePage;
