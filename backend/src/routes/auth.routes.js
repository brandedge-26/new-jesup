import express from "express";
import { registerController, loginController, logoutController, refreshTokenController, adminLoginController } from "../controllers/auth.controller.js";



export const authRoutes = express.Router();



authRoutes.post("/register", registerController);
authRoutes.post("/login", loginController);
authRoutes.post("/admin-login", adminLoginController);
authRoutes.post("/logout", logoutController);
authRoutes.get("/refresh", refreshTokenController);
