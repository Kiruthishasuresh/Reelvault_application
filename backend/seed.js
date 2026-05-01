import mongoose from "mongoose";
import dotenv from "dotenv";
import Movie from "./models/movie.js";
import User from "./models/User.js";

dotenv.config();

/**
 * Seed script - Creates a demo user and populates their watchlist
 * Run: node seed.js
 */
const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ DB Connected");

    // Clear existing data
    await Movie.deleteMany();
    await User.deleteMany();

    // Create demo user
    const demoUser = await User.create({
      username: "demo",
      email: "demo@reelvault.com",
      password: "demo123",
    });

    console.log("👤 Demo user created (email: demo@reelvault.com, password: demo123)");

    // Seed movies for demo user
    await Movie.insertMany([
      {
        title: "Inception",
        year: 2010,
        poster: "https://image.tmdb.org/t/p/w500/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg",
        backdrop: "https://image.tmdb.org/t/p/w1280/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
        watched: false,
        language: "English",
        genre: ["Sci-Fi", "Action", "Thriller"],
        overview: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        rating: 5,
        userId: demoUser._id,
      },
      {
        title: "The Dark Knight",
        year: 2008,
        poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911kpUpLaSB2Ams.jpg",
        backdrop: "https://image.tmdb.org/t/p/w1280/nMKdUUepR0i5zn0y1T4CsSB5ez.jpg",
        watched: true,
        language: "English",
        genre: ["Action", "Crime", "Drama"],
        overview: "When the menace known as the Joker wreaks havoc on Gotham, Batman must accept one of the greatest tests to fight injustice.",
        rating: 5,
        userId: demoUser._id,
      },
      {
        title: "Interstellar",
        year: 2014,
        poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        backdrop: "https://image.tmdb.org/t/p/w1280/xJHokMbljvjADYdit5fK1DVfjko.jpg",
        watched: false,
        language: "English",
        genre: ["Sci-Fi", "Adventure", "Drama"],
        overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        rating: 5,
        userId: demoUser._id,
      },
      {
        title: "The Matrix",
        year: 1999,
        poster: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
        backdrop: "https://image.tmdb.org/t/p/w1280/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg",
        watched: true,
        language: "English",
        genre: ["Sci-Fi", "Action"],
        overview: "A computer hacker learns about the true nature of his reality and his role in the war against its controllers.",
        rating: 4,
        userId: demoUser._id,
      },
      {
        title: "Baahubali: The Beginning",
        year: 2015,
        poster: "https://image.tmdb.org/t/p/w500/9BAjt8IJjlSHhsVnxKAkhWIWHYr.jpg",
        backdrop: "",
        watched: true,
        language: "Tamil",
        genre: ["Action", "Drama", "Fantasy"],
        overview: "In ancient India, an adventurous and daring man discovers his royal lineage and must fight to reclaim his kingdom.",
        rating: 5,
        userId: demoUser._id,
      },
      {
        title: "Baahubali 2: The Conclusion",
        year: 2017,
        poster: "https://image.tmdb.org/t/p/w500/hkqLmOoSwwJaRolHHMBnBuPsVDb.jpg",
        backdrop: "",
        watched: true,
        language: "Tamil",
        genre: ["Action", "Drama"],
        overview: "When Shiva learns about his heritage, he begins to look for answers. His story is juxtaposed with past events.",
        rating: 5,
        userId: demoUser._id,
      },
      {
        title: "Master",
        year: 2021,
        poster: "https://image.tmdb.org/t/p/w500/hXnEcXHHh4Xyto3hGfMw1AF3yMP.jpg",
        backdrop: "",
        watched: false,
        language: "Tamil",
        genre: ["Action", "Thriller"],
        overview: "An alcoholic professor is sent to a juvenile facility, where he clashes with a gangster who uses the inmates for criminal activities.",
        rating: 4,
        userId: demoUser._id,
      },
      {
        title: "Vikram",
        year: 2022,
        poster: "https://image.tmdb.org/t/p/w500/89q65hiLxNPHPOi98urQ7yrMzBQ.jpg",
        backdrop: "",
        watched: false,
        language: "Tamil",
        genre: ["Action", "Thriller"],
        overview: "A special agent investigates a case of serial killings, only to discover that the murders are not what they seem.",
        rating: 5,
        userId: demoUser._id,
      },
      {
        title: "Soorarai Pottru",
        year: 2020,
        poster: "https://image.tmdb.org/t/p/w500/lgJbBSlPEjB0QRuPMjJCRbtG2xi.jpg",
        backdrop: "",
        watched: false,
        language: "Tamil",
        genre: ["Drama", "Biography"],
        overview: "Inspired by events in the life of Captain Gopinath, a young man from a small village dreams of starting a low-cost airline.",
        rating: 5,
        userId: demoUser._id,
      },
      {
        title: "Parasite",
        year: 2019,
        poster: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
        backdrop: "https://image.tmdb.org/t/p/w1280/TU9NIjwzjoKPwQHoHshkFcQUCG.jpg",
        watched: false,
        language: "Korean",
        genre: ["Thriller", "Drama", "Comedy"],
        overview: "Greed and class discrimination threaten the symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
        rating: 5,
        userId: demoUser._id,
      },
      {
        title: "Oppenheimer",
        year: 2023,
        poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
        backdrop: "https://image.tmdb.org/t/p/w1280/nb3xI8XI3w4pMVZ38VijbsyBqP4.jpg",
        watched: true,
        language: "English",
        genre: ["Drama", "History", "Biography"],
        overview: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
        rating: 5,
        userId: demoUser._id,
      },
      {
        title: "Dune: Part Two",
        year: 2024,
        poster: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
        backdrop: "https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg",
        watched: false,
        language: "English",
        genre: ["Sci-Fi", "Adventure", "Drama"],
        overview: "Paul Atreides unites with Chani and the Fremen while seeking revenge against those who destroyed his family.",
        rating: 4,
        userId: demoUser._id,
      },
    ]);

    console.log("🎬 12 movies seeded successfully");
    console.log("\n🔑 Login credentials:");
    console.log("   Email: demo@reelvault.com");
    console.log("   Password: demo123");

    process.exit();
  } catch (err) {
    console.error("❌ Error seeding DB:", err);
    process.exit(1);
  }
};

seedDB();