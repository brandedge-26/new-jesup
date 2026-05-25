import { Router } from "express";
import { getReviews, createReview } from "../controllers/review.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const reviewRoutes = Router();

reviewRoutes.get( "/:productId", getReviews);
reviewRoutes.post("/:productId", authMiddleware, createReview);

export { reviewRoutes };
