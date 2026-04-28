import express from "express";
import Movie from "../models/movie.js";

const router = express.Router();

// ✅ GET all movies
router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ POST add new movie
router.post("/", async (req, res) => {
  try {
    const { title, year, poster, language } = req.body;
    const newMovie = new Movie({ title, year, poster, language });
    await newMovie.save();
    
    // FIX: Send ONLY the movie object so the frontend can add it to the list immediately
    res.status(201).json(newMovie); 
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ PUT mark movie as watched
router.put("/:id", async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      { watched: true },
      { new: true }
    );
    res.json(updatedMovie);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ DELETE movie
router.delete("/:id", async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ message: "Movie deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
