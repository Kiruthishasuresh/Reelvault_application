import React, { useState } from "react";
import axios from "axios";

const AddMovie = ({ setMovies }) => {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [poster, setPoster] = useState("");
  const [language, setLanguage] = useState("English");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newMovie = {
      title,
      year,
      poster,
      language,
      watched: false,
    };

    const res = await axios.post("http://localhost:5000/api/movies", newMovie);

    setMovies(prev => [res.data, ...prev]);

    setTitle("");
    setYear("");
    setPoster("");
  };

  return (
    <div className="add-movie-container">
      <h2>Add Movie</h2>

      <form onSubmit={handleSubmit}>
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
        <input placeholder="Year" value={year} onChange={e => setYear(e.target.value)} required />
        <input placeholder="Poster URL" value={poster} onChange={e => setPoster(e.target.value)} />

        <select value={language} onChange={e => setLanguage(e.target.value)}>
          <option>English</option>
          <option>Tamil</option>
        </select>

        <button type="submit">Add Movie</button>
      </form>
    </div>
  );
};

export default AddMovie;