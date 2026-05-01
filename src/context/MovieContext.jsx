import React, { createContext, useContext, useState, useCallback } from "react";
import { movieAPI } from "../services/api";
import toast from "react-hot-toast";

const MovieContext = createContext(null);

export const useMovies = () => {
  const ctx = useContext(MovieContext);
  if (!ctx) throw new Error("useMovies must be used within MovieProvider");
  return ctx;
};

export const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [stats, setStats] = useState({ total: 0, watched: 0, unwatched: 0, avgRating: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMovies = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await movieAPI.getAll(params);
      setMovies(res.data.data);
      setStats(res.data.stats);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch movies");
      toast.error("Failed to load movies");
    } finally {
      setLoading(false);
    }
  }, []);

  const addMovie = useCallback(async (movieData) => {
    const res = await movieAPI.create(movieData);
    setMovies((prev) => [res.data.data, ...prev]);
    setStats((prev) => ({ ...prev, total: prev.total + 1, unwatched: prev.unwatched + 1 }));
    toast.success(`"${res.data.data.title}" added to your watchlist!`);
    return res.data.data;
  }, []);

  const updateMovie = useCallback(async (id, data) => {
    const res = await movieAPI.update(id, data);
    setMovies((prev) => prev.map((m) => (m._id === id ? res.data.data : m)));
    // Update stats if watched status changed
    if (data.watched !== undefined) {
      setStats((prev) => ({
        ...prev,
        watched: data.watched ? prev.watched + 1 : prev.watched - 1,
        unwatched: data.watched ? prev.unwatched - 1 : prev.unwatched + 1,
      }));
    }
    return res.data.data;
  }, []);

  const deleteMovie = useCallback(async (id) => {
    const movie = movies.find((m) => m._id === id);
    await movieAPI.delete(id);
    setMovies((prev) => prev.filter((m) => m._id !== id));
    setStats((prev) => ({
      ...prev,
      total: prev.total - 1,
      watched: movie?.watched ? prev.watched - 1 : prev.watched,
      unwatched: movie?.watched ? prev.unwatched : prev.unwatched - 1,
    }));
    toast.success(`"${movie?.title}" removed`);
  }, [movies]);

  const toggleWatched = useCallback(async (id) => {
    const movie = movies.find((m) => m._id === id);
    if (!movie) return;
    const updated = await updateMovie(id, { watched: !movie.watched });
    toast.success(updated.watched ? `Marked "${updated.title}" as watched` : `Moved "${updated.title}" back to watchlist`);
    return updated;
  }, [movies, updateMovie]);

  const updateRating = useCallback(async (id, rating) => {
    const updated = await updateMovie(id, { rating });
    toast.success(`Rated "${updated.title}" ${rating} stars`);
    return updated;
  }, [updateMovie]);

  return (
    <MovieContext.Provider value={{ movies, stats, loading, error, fetchMovies, addMovie, updateMovie, deleteMovie, toggleWatched, updateRating }}>
      {children}
    </MovieContext.Provider>
  );
};
