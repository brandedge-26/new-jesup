import { Router } from "express";
import {
    getFeatured,
    createFeatured,
    updateFeatured,
    deleteFeatured,
} from "../controllers/featuredProduct.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const featuredRoutes = Router();

// PUBLIC — shop home page fetches trending & new arrivals
featuredRoutes.get("/", getFeatured);

// ADMIN PROTECTED
featuredRoutes.post(  "/",    authMiddleware, createFeatured);
featuredRoutes.put(   "/:id", authMiddleware, updateFeatured);
featuredRoutes.delete("/:id", authMiddleware, deleteFeatured);

export { featuredRoutes };
