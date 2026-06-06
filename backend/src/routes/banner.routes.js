import { Router } from "express";
import {
    getBanners, getAllBanners, uploadBannerImage,
    createBanner, updateBanner, deleteBanner,
} from "../controllers/banner.controller.js";
import { authMiddleware }  from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import { uploadBanner }    from "../config/multer.js";

export const bannerRoutes = Router();

// Public
bannerRoutes.get("/",            getBanners);

// Admin
bannerRoutes.get(   "/all",         authMiddleware, adminMiddleware, getAllBanners);
bannerRoutes.post(  "/upload-image",authMiddleware, adminMiddleware, uploadBanner.single("image"), uploadBannerImage);
bannerRoutes.post(  "/",            authMiddleware, adminMiddleware, createBanner);
bannerRoutes.put(   "/:id",         authMiddleware, adminMiddleware, updateBanner);
bannerRoutes.delete("/:id",         authMiddleware, adminMiddleware, deleteBanner);
