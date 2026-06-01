import express from "express";
import {
    createOrderController,
    getMyOrdersController,
    getOrderController,
    getAllOrdersController,
    updateOrderStatusController,
    deleteOrderController,
    trackOrderController,
    cancelOrderController,
} from "../controllers/order.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

export const orderRoutes = express.Router();

// Public
orderRoutes.get("/track/:orderNumber", trackOrderController);

// User routes
orderRoutes.post("/",              authMiddleware, createOrderController);
orderRoutes.get("/my",             authMiddleware, getMyOrdersController);
orderRoutes.get("/:id",            authMiddleware, getOrderController);
orderRoutes.patch("/:id/cancel",   authMiddleware, cancelOrderController);

// Admin routes
orderRoutes.get("/",             authMiddleware, adminMiddleware, getAllOrdersController);
orderRoutes.patch("/:id/status", authMiddleware, adminMiddleware, updateOrderStatusController);
orderRoutes.delete("/:id",       authMiddleware, adminMiddleware, deleteOrderController);
