import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    year: { type: String, required: true },
    poster: { type: String },
    language: { type: String, required: true },
    watched: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Movie", movieSchema);
