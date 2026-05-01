import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import movieRoutes from "./routes/movies.js";
import authRoutes from "./routes/auth.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "ReelVault API is running",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);

// 404 handler for undefined routes
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler (must be last)
app.use(errorHandler);

// Database connection and server startup
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 API available at http://localhost:${PORT}/api`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
