import mongoose from "mongoose";
import Movie from "../models/movie.js";

/**
 * @desc    Get all movies for the authenticated user with optional filtering, sorting, and search
 * @route   GET /api/movies
 * @access  Private
 * @query   search, watched, language, year, sort, page, limit
 */
export const getMovies = async (req, res, next) => {
  try {
    const { search, watched, language, year, sort, page = 1, limit = 50 } = req.query;

    // Build query filter scoped to the authenticated user
    const filter = { userId: req.user.id };

    // Search by title (case-insensitive partial match)
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    // Filter by watched status
    if (watched !== undefined && watched !== "") {
      filter.watched = watched === "true";
    }

    // Filter by language
    if (language && language !== "All") {
      filter.language = language;
    }

    // Filter by year
    if (year && year !== "All") {
      filter.year = parseInt(year);
    }

    // Build sort options
    let sortOption = { createdAt: -1 }; // Default: recently added first
    if (sort === "title") sortOption = { title: 1 };
    else if (sort === "year") sortOption = { year: -1 };
    else if (sort === "rating") sortOption = { rating: -1 };
    else if (sort === "oldest") sortOption = { createdAt: 1 };

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [movies, total] = await Promise.all([
      Movie.find(filter).sort(sortOption).skip(skip).limit(parseInt(limit)),
      Movie.countDocuments(filter),
    ]);

    // Get stats for the user (aggregate requires ObjectId)
    const userObjectId = new mongoose.Types.ObjectId(req.user.id);
    const statsResult = await Movie.aggregate([
      { $match: { userId: userObjectId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          watched: { $sum: { $cond: ["$watched", 1, 0] } },
          unwatched: { $sum: { $cond: ["$watched", 0, 1] } },
          avgRating: { $avg: { $cond: [{ $gt: ["$rating", 0] }, "$rating", null] } },
        },
      },
    ]);

    const movieStats = statsResult[0] || { total: 0, watched: 0, unwatched: 0, avgRating: 0 };

    res.json({
      success: true,
      data: movies,
      stats: {
        total: movieStats.total,
        watched: movieStats.watched,
        unwatched: movieStats.unwatched,
        avgRating: movieStats.avgRating ? parseFloat(movieStats.avgRating.toFixed(1)) : 0,
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single movie by ID
 * @route   GET /api/movies/:id
 * @access  Private
 */
export const getMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    res.json({ success: true, data: movie });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add a new movie
 * @route   POST /api/movies
 * @access  Private
 */
export const createMovie = async (req, res, next) => {
  try {
    const { title, year, poster, backdrop, language, genre, overview, rating, tmdbId } = req.body;

    // Validate required fields
    if (!title || !year || !language) {
      return res.status(400).json({
        success: false,
        message: "Title, year, and language are required",
      });
    }

    const movie = await Movie.create({
      title,
      year: parseInt(year),
      poster: poster || "",
      backdrop: backdrop || "",
      language,
      genre: genre || ["Unknown"],
      overview: overview || "",
      rating: rating || 0,
      tmdbId: tmdbId || null,
      watched: false,
      userId: req.user.id,
    });

    res.status(201).json({ success: true, data: movie });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a movie (toggle watched, update rating, etc.)
 * @route   PUT /api/movies/:id
 * @access  Private
 */
export const updateMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    // Only allow updating specific fields
    const allowedUpdates = ["title", "year", "poster", "backdrop", "language", "genre", "overview", "watched", "rating"];
    const updates = {};

    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: updatedMovie });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a movie
 * @route   DELETE /api/movies/:id
 * @access  Private
 */
export const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    res.json({
      success: true,
      message: "Movie deleted successfully",
      data: movie,
    });
  } catch (error) {
    next(error);
  }
};
