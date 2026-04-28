import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AddMovie from "./pages/AddMovie";

function Navbar() {
  const location = useLocation();
  return (
    <nav className="navbar">
      <h1 className="logo">🎬 Movie-Watchlist App</h1>
      <div className="nav-links">
        <Link className={location.pathname === "/" ? "active-link" : ""} to="/">Home</Link>
        <Link className={location.pathname === "/add" ? "active-link" : ""} to="/add">Add Movie</Link>
      </div>
    </nav>
  );
}

function App() {
  const [movies, setMovies] = useState([]);

  // Fetch movies from backend
  useEffect(() => {
    axios.get("http://localhost:5000/api/movies")
      .then(res => setMovies(res.data))
      .catch(err => console.error("Error fetching movies:", err));
  }, []);

  const handleAddMovie = async (movie) => {
    try {
      const res = await axios.post("http://localhost:5000/api/movies", movie);
      setMovies([res.data, ...movies]);
    } catch (err) {
      console.error("Error adding movie:", err);
    }
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage movies={movies} setMovies={setMovies} />} />
        <Route path="/add" element={<AddMovie onAdd={handleAddMovie} />} />
      </Routes>
    </Router>
  );
}

export default App;
