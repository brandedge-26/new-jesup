import express from "express";
import {
    validatePromoController,
    getPromosController,
    createPromoController,
    togglePromoController,
    deletePromoController,
} from "../controllers/promo.controller.js";
import { authMiddleware }  from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

export const promoRoutes = express.Router();

// User — validate code at checkout
promoRoutes.post("/validate", authMiddleware, validatePromoController);

// Admin only
promoRoutes.get(   "/",            authMiddleware, adminMiddleware, getPromosController);
promoRoutes.post(  "/",            authMiddleware, adminMiddleware, createPromoController);
promoRoutes.patch( "/:id/toggle",  authMiddleware, adminMiddleware, togglePromoController);
promoRoutes.delete("/:id",         authMiddleware, adminMiddleware, deletePromoController);
