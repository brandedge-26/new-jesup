import { Router } from "express";
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../controllers/product.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const productRoutes = Router();

// Admin protected — all product CRUD
productRoutes.get(   "/",    authMiddleware, getProducts);
productRoutes.get(   "/:id", authMiddleware, getProductById);
productRoutes.post(  "/",    authMiddleware, createProduct);
productRoutes.put(   "/:id", authMiddleware, updateProduct);
productRoutes.delete("/:id", authMiddleware, deleteProduct);

export { productRoutes };
