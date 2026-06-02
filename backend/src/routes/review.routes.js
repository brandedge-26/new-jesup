import { Router } from "express";
import { getReviews, createReview, getAllReviews, deleteReview, bulkDeleteReviews } from "../controllers/review.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

const reviewRoutes = Router();

reviewRoutes.get( "/",           authMiddleware, adminMiddleware, getAllReviews);
reviewRoutes.delete("/bulk",      authMiddleware, adminMiddleware, bulkDeleteReviews);
reviewRoutes.delete("/:reviewId", authMiddleware, adminMiddleware, deleteReview);
reviewRoutes.get( "/:productId", getReviews);
reviewRoutes.post("/:productId", authMiddleware, createReview);

export { reviewRoutes };
