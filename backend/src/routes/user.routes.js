import express from "express";
import { getUsersController, updateProfileController, changePasswordController } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

export const userRoutes = express.Router();

userRoutes.get("/",               authMiddleware, adminMiddleware, getUsersController);
userRoutes.patch("/profile",      authMiddleware, updateProfileController);
userRoutes.patch("/password",     authMiddleware, changePasswordController);
