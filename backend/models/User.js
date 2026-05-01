import mongoose from "mongoose";
import crypto from "crypto";

/**
 * User Schema - Handles authentication and user-specific watchlists.
 * Uses built-in crypto (no bcrypt dependency needed) for password hashing.
 */
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    salt: {
      type: String,
    },
    avatar: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Hash password before saving using Node.js built-in crypto
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.salt = crypto.randomBytes(16).toString("hex");
  this.password = crypto
    .pbkdf2Sync(this.password, this.salt, 10000, 64, "sha512")
    .toString("hex");
});

// Compare candidate password with stored hash
userSchema.methods.comparePassword = function (candidatePassword) {
  const hash = crypto
    .pbkdf2Sync(candidatePassword, this.salt, 10000, 64, "sha512")
    .toString("hex");
  return this.password === hash;
};

// Remove sensitive fields from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.salt;
  return obj;
};

export default mongoose.model("User", userSchema);
