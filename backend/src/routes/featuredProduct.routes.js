import { Router } from "express";
import {
    getFeatured,
    createFeatured,
    updateFeatured,
    deleteFeatured,
    cleanupFeatured,
} from "../controllers/featuredProduct.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const featuredRoutes = Router();

// PUBLIC — shop home page fetches trending & new arrivals
featuredRoutes.get("/", getFeatured);

// ADMIN PROTECTED
featuredRoutes.post(  "/",         authMiddleware, createFeatured);
featuredRoutes.delete("/cleanup",  authMiddleware, cleanupFeatured);
featuredRoutes.put(   "/:id",      authMiddleware, updateFeatured);
featuredRoutes.delete("/:id",      authMiddleware, deleteFeatured);

export { featuredRoutes };
