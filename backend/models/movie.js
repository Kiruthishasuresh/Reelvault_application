import mongoose from "mongoose";

/**
 * Movie Schema - Enhanced with rating, genre, TMDB integration fields,
 * and user association for personalized watchlists.
 */
const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Movie title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    year: {
      type: Number,
      required: [true, "Release year is required"],
      min: [1888, "Year must be after 1888"],
      max: [new Date().getFullYear() + 5, "Year cannot be too far in the future"],
    },
    poster: {
      type: String,
      default: "",
      trim: true,
    },
    backdrop: {
      type: String,
      default: "",
      trim: true,
    },
    language: {
      type: String,
      required: [true, "Language is required"],
      trim: true,
      enum: {
        values: ["English", "Tamil", "Hindi", "Telugu", "Malayalam", "Kannada", "Korean", "Japanese", "Spanish", "French", "Other"],
        message: "{VALUE} is not a supported language",
      },
    },
    genre: {
      type: [String],
      default: ["Unknown"],
    },
    overview: {
      type: String,
      default: "",
      maxlength: [2000, "Overview cannot exceed 2000 characters"],
    },
    watched: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot exceed 5"],
    },
    tmdbId: {
      type: Number,
      default: null,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound index for efficient user-specific queries
movieSchema.index({ userId: 1, title: 1 });
movieSchema.index({ userId: 1, watched: 1 });
movieSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("Movie", movieSchema);
