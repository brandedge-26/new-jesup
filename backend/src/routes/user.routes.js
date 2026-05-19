import express from "express";
import { getUsersController } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const userRoutes = express.Router();

userRoutes.get("/", authMiddleware, getUsersController);
