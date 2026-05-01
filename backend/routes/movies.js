import express from "express";
import {
  getMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
} from "../controllers/movieController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// All movie routes require authentication
router.use(auth);

router.route("/").get(getMovies).post(createMovie);
router.route("/:id").get(getMovie).put(updateMovie).delete(deleteMovie);

export default router;
