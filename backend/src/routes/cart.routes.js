import express from "express";
import { getCartController, syncCartController, clearCartController } from "../controllers/cart.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const cartRoutes = express.Router();

cartRoutes.get("/",        authMiddleware, getCartController);
cartRoutes.post("/sync",   authMiddleware, syncCartController);
cartRoutes.delete("/",     authMiddleware, clearCartController);
