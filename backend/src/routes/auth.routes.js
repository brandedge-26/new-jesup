import express from "express";
import passport from "../passport/auth.passport.js";
import {
    registerController,
    loginController,
    logoutController,
    refreshTokenController,
    adminLoginController,
} from "../controllers/auth.controller.js";
import { googleAuthSuccess, googleAuthError } from "../middlewares/passport.middleware.js";

export const authRoutes = express.Router();

// ── Standard auth ─────────────────────────────────────────────────────────────
authRoutes.post("/register",    registerController);
authRoutes.post("/login",       loginController);
authRoutes.post("/admin-login", adminLoginController);
authRoutes.post("/logout",      logoutController);
authRoutes.get( "/refresh",     refreshTokenController);

// ── Google OAuth ──────────────────────────────────────────────────────────────
authRoutes.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account" })
);

authRoutes.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/api/auth/google/error" }),
    googleAuthSuccess
);

authRoutes.get("/google/error", (req, res, next) => {
    const err = new Error("Google authentication failed. Please try again.");
    googleAuthError(err, req, res, next);
});
