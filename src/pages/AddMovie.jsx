import React, { useState } from "react";
import axios from "axios";

const AddMovie = ({ onAdd }) => {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [poster, setPoster] = useState("");
  const [language, setLanguage] = useState("English");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare the data for the backend
    const movieData = { 
      title, 
      year, 
      poster, 
      language,
      watched: false 
    };

    try {
      // POST the data to your Express server
      const res = await axios.post("http://localhost:5000/api/movies", movieData);
      
      // Update the local state in the parent component
      if (onAdd) onAdd(res.data); 

      // Clear the form
      setTitle("");
      setYear("");
      setPoster("");
      setLanguage("English");
      alert("Movie added successfully!");
    } catch (err) {
      console.error("Failed to add movie:", err);
      alert("Error saving movie to database.");
    }
  };

  return (
    <div className="add-movie-container">
      <h2>Add a New Movie</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Movie Title" value={title} onChange={e => setTitle(e.target.value)} required />
        <input type="number" placeholder="Release Year" value={year} onChange={e => setYear(e.target.value)} required />
        <input type="text" placeholder="Poster URL (optional)" value={poster} onChange={e => setPoster(e.target.value)} />
        <select value={language} onChange={e => setLanguage(e.target.value)}>
          <option value="English">English</option>
          <option value="Tamil">Tamil</option>
        </select>
        <button type="submit">Add Movie</button>
      </form>
    </div>
  );
};

export default AddMovie;
