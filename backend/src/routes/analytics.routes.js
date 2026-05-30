import express from "express";
import { getAnalyticsController } from "../controllers/analytics.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

export const analyticsRoutes = express.Router();

analyticsRoutes.get("/", authMiddleware, adminMiddleware, getAnalyticsController);
