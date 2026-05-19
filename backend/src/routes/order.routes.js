import express from "express";
import {
    createOrderController,
    getMyOrdersController,
    getOrderController,
    getAllOrdersController,
    updateOrderStatusController,
    deleteOrderController,
    trackOrderController,
} from "../controllers/order.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const orderRoutes = express.Router();

// Public
orderRoutes.get("/track/:orderNumber", trackOrderController);

// User routes
orderRoutes.post("/",          authMiddleware, createOrderController);
orderRoutes.get("/my",         authMiddleware, getMyOrdersController);
orderRoutes.get("/:id",        authMiddleware, getOrderController);

// Admin routes
orderRoutes.get("/",           authMiddleware, getAllOrdersController);
orderRoutes.patch("/:id/status", authMiddleware, updateOrderStatusController);
orderRoutes.delete("/:id",     authMiddleware, deleteOrderController);
