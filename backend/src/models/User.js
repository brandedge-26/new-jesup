import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fname: { type: String, required: true,  trim: true },
    lname: { type: String, required: true,  trim: true },
    email: { type: String, required: true,  unique: true, lowercase: true, trim: true },
    password: { type: String, default: null },  // null for OAuth users
    role:     { type: String, enum: ["user", "admin"], default: "user" },

    // OAuth fields
    provider:        { type: String, default: "local" }, // "local" | "google"
    providerId:      { type: String, default: null },
    profilePicture:  { type: String, default: null },
    isEmailVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
